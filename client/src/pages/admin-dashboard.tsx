import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDate, getStatusColor } from "@/lib/utils";
import type { Package, InsertPackage } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [newPackage, setNewPackage] = useState<InsertPackage>({
    status: 'On Hold',
    sender: { name: "", address: "" },
    receiver: { name: "", address: "" },
    currentLocation: { address: "", lat: 0, lng: 0 },
    packageDetails: { type: "", weight: "", height: "", color: "" },
    adminNotes: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin session
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['/api/admin/session'],
    retry: false,
  });

  // Get packages
  const { data: packages = [], isLoading: packagesLoading } = useQuery({
    queryKey: ['/api/admin/packages'],
    enabled: !!session?.isAdmin,
  });

  // Redirect if not admin
  useEffect(() => {
    if (!sessionLoading && !session?.isAdmin) {
      setLocation('/admin-login');
    }
  }, [session, sessionLoading, setLocation]);

  // Create package mutation
  const createPackageMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/admin/packages', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to create package');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/packages'] });
      toast({
        title: "Package Created",
        description: "New package has been created successfully.",
      });
      resetNewPackageForm();
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Failed to create package. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update package mutation
  const updatePackageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: 'PUT',
        body: data,
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to update package');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/packages'] });
      toast({
        title: "Package Updated",
        description: "Package has been updated successfully.",
      });
      setEditingPackage(null);
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update package. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/admin/logout');
      setLocation('/');
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetNewPackageForm = () => {
    setNewPackage({
      status: 'On Hold',
      sender: { name: "", address: "" },
      receiver: { name: "", address: "" },
      currentLocation: { address: "", lat: 0, lng: 0 },
      packageDetails: { type: "", weight: "", height: "", color: "" },
      adminNotes: "",
    });
    setSelectedFile(null);
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('status', newPackage.status);
    formData.append('sender[name]', newPackage.sender.name);
    formData.append('sender[address]', newPackage.sender.address);
    formData.append('receiver[name]', newPackage.receiver.name);
    formData.append('receiver[address]', newPackage.receiver.address);
    formData.append('currentLocationAddress', newPackage.currentLocation.address);
    formData.append('currentLocationLat', newPackage.currentLocation.lat.toString());
    formData.append('currentLocationLng', newPackage.currentLocation.lng.toString());
    formData.append('packageType', newPackage.packageDetails.type);
    formData.append('packageWeight', newPackage.packageDetails.weight);
    formData.append('packageHeight', newPackage.packageDetails.height);
    formData.append('packageColor', newPackage.packageDetails.color);
    formData.append('adminNotes', newPackage.adminNotes);
    
    if (selectedFile) {
      formData.append('photo', selectedFile);
    }

    createPackageMutation.mutate(formData);
  };

  const handleUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    
    const formData = new FormData();
    formData.append('status', editingPackage.status);
    formData.append('sender[name]', editingPackage.sender.name);
    formData.append('sender[address]', editingPackage.sender.address);
    formData.append('receiver[name]', editingPackage.receiver.name);
    formData.append('receiver[address]', editingPackage.receiver.address);
    formData.append('currentLocationAddress', editingPackage.currentLocation.address);
    formData.append('currentLocationLat', editingPackage.currentLocation.lat.toString());
    formData.append('currentLocationLng', editingPackage.currentLocation.lng.toString());
    formData.append('packageType', editingPackage.packageDetails.type);
    formData.append('packageWeight', editingPackage.packageDetails.weight);
    formData.append('packageHeight', editingPackage.packageDetails.height);
    formData.append('packageColor', editingPackage.packageDetails.color);
    formData.append('adminNotes', editingPackage.adminNotes);
    
    if (selectedFile) {
      formData.append('photo', selectedFile);
    }

    updatePackageMutation.mutate({ id: editingPackage.id, data: formData });
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-shipping-fast text-2xl text-primary mr-3"></i>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="destructive"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create/Edit Package Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingPackage ? 'Edit Package' : 'Create New Package'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingPackage ? handleUpdatePackage : handleCreatePackage} className="space-y-4">
                  {/* Sender Information */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Sender Information</h3>
                    <Input
                      placeholder="Sender Name"
                      value={editingPackage ? editingPackage.sender.name : newPackage.sender.name}
                      onChange={(e) => {
                        if (editingPackage) {
                          setEditingPackage({
                            ...editingPackage,
                            sender: { ...editingPackage.sender, name: e.target.value }
                          });
                        } else {
                          setNewPackage({
                            ...newPackage,
                            sender: { ...newPackage.sender, name: e.target.value }
                          });
                        }
                      }}
                      className="mb-2"
                      required
                    />
                    <Textarea
                      placeholder="Sender Address"
                      value={editingPackage ? editingPackage.sender.address : newPackage.sender.address}
                      onChange={(e) => {
                        if (editingPackage) {
                          setEditingPackage({
                            ...editingPackage,
                            sender: { ...editingPackage.sender, address: e.target.value }
                          });
                        } else {
                          setNewPackage({
                            ...newPackage,
                            sender: { ...newPackage.sender, address: e.target.value }
                          });
                        }
                      }}
                      rows={2}
                      required
                    />
                  </div>

                  {/* Receiver Information */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Receiver Information</h3>
                    <Input
                      placeholder="Receiver Name"
                      value={editingPackage ? editingPackage.receiver.name : newPackage.receiver.name}
                      onChange={(e) => {
                        if (editingPackage) {
                          setEditingPackage({
                            ...editingPackage,
                            receiver: { ...editingPackage.receiver, name: e.target.value }
                          });
                        } else {
                          setNewPackage({
                            ...newPackage,
                            receiver: { ...newPackage.receiver, name: e.target.value }
                          });
                        }
                      }}
                      className="mb-2"
                      required
                    />
                    <Textarea
                      placeholder="Receiver Address"
                      value={editingPackage ? editingPackage.receiver.address : newPackage.receiver.address}
                      onChange={(e) => {
                        if (editingPackage) {
                          setEditingPackage({
                            ...editingPackage,
                            receiver: { ...editingPackage.receiver, address: e.target.value }
                          });
                        } else {
                          setNewPackage({
                            ...newPackage,
                            receiver: { ...newPackage.receiver, address: e.target.value }
                          });
                        }
                      }}
                      rows={2}
                      required
                    />
                  </div>

                  {/* Package Details */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Package Details</h3>
                    <Select
                      value={editingPackage ? editingPackage.status : newPackage.status}
                      onValueChange={(value: any) => {
                        if (editingPackage) {
                          setEditingPackage({ ...editingPackage, status: value });
                        } else {
                          setNewPackage({ ...newPackage, status: value });
                        }
                      }}
                    >
                      <SelectTrigger className="mb-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                        <SelectItem value="In Transit">In Transit</SelectItem>
                        <SelectItem value="Held by Customs">Held by Customs</SelectItem>
                        <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Package Physical Details */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Input
                        placeholder="Package Type"
                        value={editingPackage ? editingPackage.packageDetails.type : newPackage.packageDetails.type}
                        onChange={(e) => {
                          if (editingPackage) {
                            setEditingPackage({
                              ...editingPackage,
                              packageDetails: { ...editingPackage.packageDetails, type: e.target.value }
                            });
                          } else {
                            setNewPackage({
                              ...newPackage,
                              packageDetails: { ...newPackage.packageDetails, type: e.target.value }
                            });
                          }
                        }}
                        required
                      />
                      <Input
                        placeholder="Weight (e.g., 2.5 kg)"
                        value={editingPackage ? editingPackage.packageDetails.weight : newPackage.packageDetails.weight}
                        onChange={(e) => {
                          if (editingPackage) {
                            setEditingPackage({
                              ...editingPackage,
                              packageDetails: { ...editingPackage.packageDetails, weight: e.target.value }
                            });
                          } else {
                            setNewPackage({
                              ...newPackage,
                              packageDetails: { ...newPackage.packageDetails, weight: e.target.value }
                            });
                          }
                        }}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Input
                        placeholder="Height (e.g., 15 cm)"
                        value={editingPackage ? editingPackage.packageDetails.height : newPackage.packageDetails.height}
                        onChange={(e) => {
                          if (editingPackage) {
                            setEditingPackage({
                              ...editingPackage,
                              packageDetails: { ...editingPackage.packageDetails, height: e.target.value }
                            });
                          } else {
                            setNewPackage({
                              ...newPackage,
                              packageDetails: { ...newPackage.packageDetails, height: e.target.value }
                            });
                          }
                        }}
                        required
                      />
                      <Input
                        placeholder="Color"
                        value={editingPackage ? editingPackage.packageDetails.color : newPackage.packageDetails.color}
                        onChange={(e) => {
                          if (editingPackage) {
                            setEditingPackage({
                              ...editingPackage,
                              packageDetails: { ...editingPackage.packageDetails, color: e.target.value }
                            });
                          } else {
                            setNewPackage({
                              ...newPackage,
                              packageDetails: { ...newPackage.packageDetails, color: e.target.value }
                            });
                          }
                        }}
                        required
                      />
                    </div>
                    
                    <Input
                      placeholder="Current Location Address"
                      value={editingPackage ? editingPackage.currentLocation.address : newPackage.currentLocation.address}
                      onChange={(e) => {
                        if (editingPackage) {
                          setEditingPackage({
                            ...editingPackage,
                            currentLocation: { ...editingPackage.currentLocation, address: e.target.value }
                          });
                        } else {
                          setNewPackage({
                            ...newPackage,
                            currentLocation: { ...newPackage.currentLocation, address: e.target.value }
                          });
                        }
                      }}
                      className="mb-2"
                      required
                    />
                    
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Input
                        type="number"
                        step="any"
                        placeholder="Latitude"
                        value={editingPackage ? editingPackage.currentLocation.lat : newPackage.currentLocation.lat}
                        onChange={(e) => {
                          const lat = parseFloat(e.target.value) || 0;
                          if (editingPackage) {
                            setEditingPackage({
                              ...editingPackage,
                              currentLocation: { ...editingPackage.currentLocation, lat }
                            });
                          } else {
                            setNewPackage({
                              ...newPackage,
                              currentLocation: { ...newPackage.currentLocation, lat }
                            });
                          }
                        }}
                        required
                      />
                      <Input
                        type="number"
                        step="any"
                        placeholder="Longitude"
                        value={editingPackage ? editingPackage.currentLocation.lng : newPackage.currentLocation.lng}
                        onChange={(e) => {
                          const lng = parseFloat(e.target.value) || 0;
                          if (editingPackage) {
                            setEditingPackage({
                              ...editingPackage,
                              currentLocation: { ...editingPackage.currentLocation, lng }
                            });
                          } else {
                            setNewPackage({
                              ...newPackage,
                              currentLocation: { ...newPackage.currentLocation, lng }
                            });
                          }
                        }}
                        required
                      />
                    </div>
                    
                    <Textarea
                      placeholder="Admin Notes"
                      value={editingPackage ? editingPackage.adminNotes : newPackage.adminNotes}
                      onChange={(e) => {
                        if (editingPackage) {
                          setEditingPackage({ ...editingPackage, adminNotes: e.target.value });
                        } else {
                          setNewPackage({ ...newPackage, adminNotes: e.target.value });
                        }
                      }}
                      rows={3}
                      className="mb-2"
                      required
                    />
                    
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                  </div>

                  <div className="flex gap-2">
                    {editingPackage && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingPackage(null);
                          setSelectedFile(null);
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={createPackageMutation.isPending || updatePackageMutation.isPending}
                      className="flex-1"
                    >
                      {editingPackage 
                        ? (updatePackageMutation.isPending ? 'Updating...' : 'Update Package')
                        : (createPackageMutation.isPending ? 'Creating...' : 'Create Package')
                      }
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Package List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Package Management</CardTitle>
              </CardHeader>
              <CardContent>
                {packagesLoading ? (
                  <div className="text-center py-8">
                    <i className="fas fa-spinner fa-spin text-2xl text-primary mb-2"></i>
                    <p className="text-gray-600">Loading packages...</p>
                  </div>
                ) : packages.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="fas fa-box text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-600">No packages found. Create your first package above.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {packages.map((pkg: Package) => (
                      <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Tracking: {pkg.trackingNumber}
                              {editingPackage?.id === pkg.id && (
                                <span className="ml-2 text-sm text-blue-600">(Editing)</span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {pkg.sender.name} → {pkg.receiver.name}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(pkg.status)}>
                              {pkg.status}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingPackage(pkg);
                                setSelectedFile(null);
                              }}
                              disabled={editingPackage?.id === pkg.id}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <i className="fas fa-map-marker-alt mr-1"></i>
                          {pkg.currentLocation.address}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Created: {formatDate(pkg.createdAt)}
                          {pkg.updatedAt !== pkg.createdAt && (
                            <span> • Updated: {formatDate(pkg.updatedAt)}</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {pkg.adminNotes}
                        </p>
                        {pkg.photo && (
                          <div className="mt-2">
                            <img
                              src={`/uploads/${pkg.photo}`}
                              alt="Package photo"
                              className="w-16 h-16 object-cover rounded border"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

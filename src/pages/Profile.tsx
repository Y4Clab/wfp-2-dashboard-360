import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Camera, 
  CheckCircle, 
  Edit, 
  Mail, 
  MapPin, 
  Phone, 
  Save, 
  User, 
  UserCircle, 
  X 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/context/AuthContext";

interface ProfileData {
  profile_unique_id: string;
  profile_organization: string;
  profile_firstname: string;
  profile_lastname: string;
  profile_email: string;
  profile_phone: string;
  profile_type: string;
  user_role: {
    role_name: string;
    role_description: string;
  };
}

const Profile = () => {
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState<ProfileData>({
    profile_unique_id: "",
    profile_organization: "",
    profile_firstname: "",
    profile_lastname: "",
    profile_email: "",
    profile_phone: "",
    profile_type: "",
    user_role: {
      role_name: "",
      role_description: ""
    }
  });

  useEffect(() => {
    if (user) {
      setFormData(user as unknown as ProfileData);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsEditing(false);
    await refreshProfile();
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and settings
          </p>
        </div>
        <Button 
          variant={isEditing ? "destructive" : "default"}
          onClick={() => {
            if (isEditing && user) {
              // Reset to original values
              setFormData(user as unknown as ProfileData);
            }
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-background">
                  <div className="h-full w-full bg-wfp-blue flex items-center justify-center text-white text-4xl font-bold">
                    {formData.profile_firstname?.[0]}{formData.profile_lastname?.[0]}
                  </div>
                </div>
                {isEditing && (
                  <Button 
                    size="icon" 
                    className="absolute -right-2 bottom-0 z-10 rounded-full shadow-sm" 
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold">{formData.profile_firstname} {formData.profile_lastname}</h2>
                <Badge variant="outline" className="mt-1 bg-blue-100 text-blue-700">
                  {formData.profile_type}
                </Badge>
              </div>

              <Separator className="my-2" />

              <div className="w-full space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formData.profile_email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formData.profile_phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formData.profile_organization}</span>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="text-center space-y-2">
                <h3 className="font-medium">Role Information</h3>
                <div className="flex gap-2 justify-center">
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {formData.user_role.role_name}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              {isEditing 
                ? "Edit your personal information below" 
                : "View and manage your personal information"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="profile_firstname" className="text-sm font-medium">
                    First Name
                  </label>
                  {isEditing ? (
                    <Input
                      id="profile_firstname"
                      name="profile_firstname"
                      value={formData.profile_firstname}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="px-3 py-2 rounded-md bg-muted/40">
                      <span className="text-sm">{formData.profile_firstname}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="profile_lastname" className="text-sm font-medium">
                    Last Name
                  </label>
                  {isEditing ? (
                    <Input
                      id="profile_lastname"
                      name="profile_lastname"
                      value={formData.profile_lastname}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="px-3 py-2 rounded-md bg-muted/40">
                      <span className="text-sm">{formData.profile_lastname}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="profile_email" className="text-sm font-medium">
                    Email Address
                  </label>
                  {isEditing ? (
                    <Input
                      id="profile_email"
                      name="profile_email"
                      type="email"
                      value={formData.profile_email}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="px-3 py-2 rounded-md bg-muted/40">
                      <span className="text-sm">{formData.profile_email}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="profile_phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <Input
                      id="profile_phone"
                      name="profile_phone"
                      value={formData.profile_phone}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="px-3 py-2 rounded-md bg-muted/40">
                      <span className="text-sm">{formData.profile_phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="profile_organization" className="text-sm font-medium">
                    Organization
                  </label>
                  {isEditing ? (
                    <Input
                      id="profile_organization"
                      name="profile_organization"
                      value={formData.profile_organization}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="px-3 py-2 rounded-md bg-muted/40">
                      <span className="text-sm">{formData.profile_organization}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="profile_type" className="text-sm font-medium">
                    Profile Type
                  </label>
                  <div className="px-3 py-2 rounded-md bg-muted/40">
                    <span className="text-sm">{formData.profile_type}</span>
                  </div>
                </div>
              </div>
              
              {isEditing && (
                <div className="mt-6">
                  <Button onClick={handleSaveProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
            <CardDescription>
              Your role and permissions in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 rounded-md bg-muted/50">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 mr-4">
                  <UserCircle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{formData.user_role.role_name}</p>
                  <p className="text-sm text-muted-foreground">{formData.user_role.role_description}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Profile;

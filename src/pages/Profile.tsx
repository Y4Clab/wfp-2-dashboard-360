
import { useState } from "react";
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

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "John Doe",
    role: "WFP Admin",
    email: "john.doe@wfp.org",
    phone: "+1 (555) 123-4567",
    location: "Nairobi, Kenya",
    bio: "WFP logistics and operations administrator with over 5 years of experience coordinating food distribution missions across East Africa.",
    profilePic: "https://randomuser.me/api/portraits/men/32.jpg"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
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
            if (isEditing) {
              // Reset to original values
              setFormData({
                name: "John Doe",
                role: "WFP Admin",
                email: "john.doe@wfp.org",
                phone: "+1 (555) 123-4567",
                location: "Nairobi, Kenya",
                bio: "WFP logistics and operations administrator with over 5 years of experience coordinating food distribution missions across East Africa.",
                profilePic: "https://randomuser.me/api/portraits/men/32.jpg"
              });
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
                  <img
                    src={formData.profilePic}
                    alt={formData.name}
                    className="h-full w-full object-cover"
                  />
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
                <h2 className="text-xl font-bold">{formData.name}</h2>
                <Badge variant="outline" className="mt-1 bg-blue-100 text-blue-700">
                  {formData.role}
                </Badge>
              </div>

              <Separator className="my-2" />

              <div className="w-full space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formData.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formData.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formData.location}</span>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="text-center space-y-2">
                <h3 className="font-medium">Account Status</h3>
                <div className="flex gap-2 justify-center">
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700">
                    Active
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
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="px-3 py-2 rounded-md bg-muted/40">
                      <span className="text-sm">{formData.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="px-3 py-2 rounded-md bg-muted/40">
                      <span className="text-sm">{formData.email}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="px-3 py-2 rounded-md bg-muted/40">
                      <span className="text-sm">{formData.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location
                  </label>
                  {isEditing ? (
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="px-3 py-2 rounded-md bg-muted/40">
                      <span className="text-sm">{formData.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={5}
                  />
                ) : (
                  <div className="px-3 py-2 rounded-md bg-muted/40 min-h-[80px]">
                    <span className="text-sm">{formData.bio}</span>
                  </div>
                )}
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
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>
              Recent activity on your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Profile updated", timestamp: "10 minutes ago", icon: <UserCircle className="h-4 w-4" /> },
                { action: "Logged in from new device", timestamp: "2 days ago", icon: <User className="h-4 w-4" /> },
                { action: "Password changed", timestamp: "1 week ago", icon: <User className="h-4 w-4" /> },
              ].map((activity, i) => (
                <div 
                  key={i} 
                  className="flex items-center p-3 rounded-md hover:bg-muted/50"
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted mr-4">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Profile;

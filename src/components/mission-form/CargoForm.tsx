import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MissionFormValues, Product } from "@/types/mission-form";

interface CargoFormProps {
  form: UseFormReturn<MissionFormValues>;
  loading: boolean;
  loadingData: boolean;
  products: Product[];
  onSubmitCargo: (e: React.FormEvent) => void;
  selectedProducts: string[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
  handleProductChange: (productId: string, checked: boolean) => void;
  handleQuantityChange: (productId: string, quantity: number) => void;
}

const CargoForm = ({
  form,
  loading,
  loadingData,
  products,
  onSubmitCargo,
  selectedProducts,
  handleProductChange,
  handleQuantityChange
}: CargoFormProps) => {
  const navigate = useNavigate();

  return (
    <Form {...form}>
      <form 
        onSubmit={onSubmitCargo} 
        className="space-y-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Cargo Details</CardTitle>
            <CardDescription>
              Specify food items and quantities for delivery
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="foodItems"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Food Types & Quantities</FormLabel>
                    <FormDescription>
                      Select products and specify quantities
                    </FormDescription>
                  </div>
                  
                  {loadingData ? (
                    <div className="py-8 flex justify-center">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                      <span className="ml-2">Loading products...</span>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="py-4 text-center text-muted-foreground">
                      No products available. Please add products first.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.map((product) => {
                        const isSelected = selectedProducts.includes(product.unique_id);
                        const foodItem = form.getValues().foodItems?.find(item => item.id === product.unique_id);
                        const quantity = foodItem?.quantity || 0;
                        
                        return (
                          <div key={product.unique_id} className="rounded-md border p-4 space-y-3">
                            <div className="flex flex-row items-start space-x-3 space-y-0">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => {
                                  handleProductChange(product.unique_id, !!checked);
                                }}
                              />
                              <div>
                                <FormLabel className="font-medium cursor-pointer">
                                  {product.name}
                                </FormLabel>
                                <p className="text-xs text-muted-foreground">
                                  Available: {product.quantity} kg
                                </p>
                              </div>
                            </div>
                            
                            {isSelected && (
                              <div className="mt-2 pl-7">
                                <FormLabel className="text-sm">Quantity (kg)</FormLabel>
                                <div className="flex items-center mt-1">
                                  <Input 
                                    type="number"
                                    min="1"
                                    max={product.quantity}
                                    value={quantity}
                                    onChange={(e) => handleQuantityChange(product.unique_id, parseFloat(e.target.value) || 0)}
                                    className="w-full"
                                    placeholder="e.g., 100"
                                  />
                                  <span className="ml-2 text-sm text-muted-foreground">kg</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="totalWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Cargo Weight (kg)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      placeholder="e.g., 5000" 
                      {...field} 
                      readOnly
                    />
                  </FormControl>
                  <FormDescription>
                    Automatically calculated based on food quantities
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-4 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/dashboard/missions')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Adding Cargo...
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-2" />
                  Add Cargo
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CargoForm; 
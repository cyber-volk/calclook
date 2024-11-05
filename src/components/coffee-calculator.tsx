"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, RotateCcw } from "lucide-react"

export function CoffeeCalculator() {
  const [productCounts, setProductCounts] = useState<{ [key: string]: number[] }>({})
  const [itemCounts, setItemCounts] = useState<{ [key: string]: { initial: number; remaining: number } }>({})
  const [totalResult, setTotalResult] = useState<number | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Image upload functionality to be implemented')
  }

  const products = [
    { name: "Express", price: 1500 },
    { name: "Capucin", price: 1800 },
    { name: "Direct", price: 2000 },
    { name: "Jus d'orange", price: 2000 },
    { name: "Café au lait", price: 2000 },
    { name: "Thé", price: 1000 }
  ]

  const denominations = [
    { name: "Boisson gazeuse", amount: 1500 },
    { name: "ماء كبير", amount: 1300 },
    { name: "ماء صغير", amount: 800 },
    { name: "Goblet", amount: 100 },
    { name: "Cake", amount: 1000 }
  ]

  const handleGridClick = (productIndex: number, gridIndex: number) => {
    if (typeof window !== 'undefined') {
      document.addEventListener('touchstart', function(e) {
        e.preventDefault();
      }, { passive: false });
    }

    setProductCounts(prevCounts => {
      const productName = products[productIndex].name;
      const newCounts = { ...prevCounts };
      
      if (!newCounts[productName]) {
        newCounts[productName] = [];
      }
      
      const index = newCounts[productName].indexOf(gridIndex);
      if (index > -1) {
        newCounts[productName] = newCounts[productName].filter(i => i !== gridIndex);
      } else {
        newCounts[productName] = [...newCounts[productName], gridIndex];
      }
      
      return newCounts;
    });
  };

  const calculateProductTotal = (productName: string) => {
    const count = productCounts[productName]?.length || 0
    const price = products.find(p => p.name === productName)?.price || 0
    return count * price
  }

  const handleItemCountChange = (item: string, field: 'initial' | 'remaining', value: string) => {
    const numValue = value === '' ? 0 : parseInt(value);
    setItemCounts(prev => ({
      ...prev,
      [item]: { ...prev[item], [field]: numValue }
    }));
  };

  const calculateItemTotal = (item: string) => {
    const { initial = 0, remaining = 0 } = itemCounts[item] || {}
    const sold = initial - remaining
    const price = denominations.find(d => d.name === item)?.amount || 0
    return sold * price
  }

  const calculateAllProductsTotal = () => {
    return products.reduce((total, product) => total + calculateProductTotal(product.name), 0)
  }

  const calculateAllItemsTotal = () => {
    return denominations.reduce((total, item) => total + calculateItemTotal(item.name), 0)
  }

  const calculateGrandTotal = () => {
    const productsTotal = calculateAllProductsTotal()
    const itemsTotal = calculateAllItemsTotal()
    setTotalResult(productsTotal + itemsTotal)
  }

  const handleReset = () => {
    setProductCounts({})
    setItemCounts({})
    setTotalResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4 touch-manipulation">
      <Card className="w-full mx-auto shadow-lg">
        <CardContent className="p-3 md:p-8">
          {/* Grid Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {products.map((product, index) => (
              <div key={index} className="space-y-2 bg-white p-2 rounded-xl shadow-sm">
                <div className="text-center font-medium border-b border-gray-200 pb-1">
                  <span className="text-base md:text-lg tracking-wide text-gray-800">{product.name}</span>
                  <br />
                  {product.price > 0 && (
                    <span className="text-sm font-bold text-gray-600">
                      {product.price.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div
                      key={`${index}-${i}`}
                      onClick={() => handleGridClick(index, i)}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        handleGridClick(index, i);
                      }}
                      className={`
                        w-5 h-5 md:w-6 md:h-6
                        flex items-center justify-center
                        rounded-md border-2
                        cursor-pointer
                        touch-manipulation
                        select-none
                        ${productCounts[product.name]?.includes(i)
                          ? 'bg-gray-800 border-gray-800 text-white'
                          : 'border-gray-300 active:border-gray-400'
                        }
                      `}
                    >
                      {productCounts[product.name]?.includes(i) && (
                        <span className="text-sm md:text-base font-bold select-none">X</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center text-sm md:text-base text-gray-600 font-medium">
                  {calculateProductTotal(product.name).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto -mx-3 px-3">
            <Table className="border rounded-lg overflow-hidden mb-4 md:mb-8 w-full">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center whitespace-nowrap p-2 md:p-4 text-sm md:text-base font-bold text-gray-700">المجموع</TableHead>
                  <TableHead className="text-center whitespace-nowrap p-2 md:p-4 text-sm md:text-base font-bold text-gray-700">المباع</TableHead>
                  <TableHead className="text-center whitespace-nowrap p-2 md:p-4 text-sm md:text-base font-bold text-gray-700">الباقي</TableHead>
                  <TableHead className="text-center whitespace-nowrap p-2 md:p-4 text-sm md:text-base font-bold text-gray-700">العدد</TableHead>
                  <TableHead className="text-center whitespace-nowrap p-2 md:p-4 text-sm md:text-base font-bold text-gray-700">Item</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {denominations.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="text-center p-2 md:p-4 text-sm md:text-base font-medium text-gray-700">
                      {calculateItemTotal(item.name) > 0 && calculateItemTotal(item.name).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center p-2 md:p-4 text-sm md:text-base font-medium text-gray-700">
                      {((itemCounts[item.name]?.initial || 0) - (itemCounts[item.name]?.remaining || 0)) > 0 && 
                        ((itemCounts[item.name]?.initial || 0) - (itemCounts[item.name]?.remaining || 0)).toString()}
                    </TableCell>
                    <TableCell className="p-1 md:p-2">
                      <Input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full text-center text-sm md:text-base rounded-lg border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                        value={itemCounts[item.name]?.remaining || ''}
                        onChange={(e) => handleItemCountChange(item.name, 'remaining', e.target.value)}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="p-1 md:p-2">
                      <Input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full text-center text-sm md:text-base rounded-lg border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                        value={itemCounts[item.name]?.initial || ''}
                        onChange={(e) => handleItemCountChange(item.name, 'initial', e.target.value)}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="text-center p-2 md:p-4">
                      <div className="font-bold text-sm md:text-base text-gray-800">{item.name}</div>
                      <div className="text-xs md:text-sm font-bold text-gray-600">{item.amount.toLocaleString()}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Bottom Controls Section */}
          <div className="mt-4 md:mt-8 space-y-4">
            {totalResult !== null && (
              <div className="text-center">
                <div className="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg">
                  <span className="text-2xl md:text-3xl font-bold tracking-wide">
                    {totalResult.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                  className="rounded-full h-10 w-10 md:h-12 md:w-12 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <RotateCcw className="h-4 w-4 md:h-5 md:w-5" />
                </Button>

                <Label 
                  htmlFor="image-upload" 
                  className="cursor-pointer bg-white rounded-full p-2 md:p-3 shadow-md hover:shadow-lg transition-shadow"
                >
                  <Upload className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </Label>
              </div>

              <Button 
                onClick={calculateGrandTotal}
                className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 md:px-6 md:py-3 rounded-xl text-base md:text-lg font-semibold shadow-md active:bg-gray-700"
              >
                Total
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
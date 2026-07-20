import { PageTransition } from "@/components/ui/PageTransition";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/StarRating";
import { ShoppingBag, Star, Filter, Download } from "lucide-react";

const products = [
  { id: "p1", title: "مخطط الرواية الاحترافي", author: "محمد الشريف", type: "قالب Notion", price: 150, rating: 4.9, image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80" },
  { id: "p2", title: "كتاب 'أسرار النشر'", author: "ليلى المنصور", type: "كتاب إلكتروني", price: 250, rating: 4.8, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80" },
  { id: "p3", title: "أداة بناء العوالم", author: "سارة العمري", type: "ملف Excel", price: 90, rating: 4.7, image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80" },
  { id: "p4", title: "جلسة نقد استشارية", author: "أحمد القاسم", type: "خدمة (1 ساعة)", price: 500, rating: 5.0, image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80" },
];

export default function Marketplace() {
  return (
    <PageTransition dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-2">السوق</h1>
          <p className="text-muted-foreground">أدوات، قوالب، وكتب لدعم مسيرتك الإبداعية.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-background">
            <Filter className="w-4 h-4" /> تصفية
          </Button>
          <Button className="gap-2 font-bold">
            <ShoppingBag className="w-4 h-4" /> السلة (0)
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
         {["الكل", "قوالب وأدوات", "كتب إلكترونية", "خدمات واستشارات", "تصميم أغلفة"].map(cat => (
           <Badge key={cat} variant={cat === "الكل" ? "default" : "outline"} className={`px-4 py-2 text-sm cursor-pointer whitespace-nowrap ${cat === "الكل" ? "bg-primary text-primary-foreground" : "hover:bg-muted bg-card"}`}>
             {cat}
           </Badge>
         ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <Card key={product.id} className="overflow-hidden hover-elevate border-border group flex flex-col">
            <div className="h-48 relative overflow-hidden bg-muted">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <Badge className="absolute top-3 right-3 bg-background/90 text-foreground backdrop-blur-sm border-0 font-medium">
                {product.type}
              </Badge>
            </div>
            <CardContent className="p-5 flex flex-col flex-1">
              <h3 className="font-bold text-lg mb-1 line-clamp-1">{product.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{product.author}</p>
              
              <div className="flex items-center gap-1.5 mb-4 mt-auto">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-bold">{product.rating}</span>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="font-bold text-lg text-primary">{product.price} <span className="text-sm font-normal">جنيه</span></span>
                <Button size="sm" variant="outline" className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                  <Download className="w-4 h-4" /> شراء
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageTransition>
  );
}

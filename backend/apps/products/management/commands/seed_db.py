from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.products.models import Category, Tag, Product, Review
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with categories, tags, products, and reviews'

    def handle(self, *args, **options):
        # 1. Create a demo user if it doesn't exist
        demo_user, created = User.objects.get_or_create(
            username='user1',
            email='aiecomdemo@gmail.com'
        )
        if created:
            demo_user.set_password('UserPass123!')
            demo_user.save()
            self.stdout.write(self.style.SUCCESS("Created demo user 'user1'"))

        # 2. Create products list
        products_data = [
            # mobile / smartphones
            {
                "id": 201, "title": "iPhone 15 Pro", "price": 999.00, "description": "Titanium design, A17 Pro chip, versatile 48MP main camera system.",
                "category": "mobile", "tags": ["mobile", "smartphone", "tech", "apple", "iphone", "ios"],
                "image": "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800",
                "rate": 4.9, "count": 450, "is_featured": True
            },
            {
                "id": 202, "title": "Samsung Galaxy S24 Ultra", "price": 1199.99, "description": "Galaxy AI is here. Experience new levels of creativity and productivity.",
                "category": "mobile", "tags": ["mobile", "smartphone", "android", "samsung", "galaxy", "tech"],
                "image": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800",
                "rate": 4.8, "count": 380, "is_featured": True
            },
            {
                "id": 211, "title": "Google Pixel 8 Pro", "price": 899.00, "description": "The all-pro phone engineered by Google. It's sleek, sophisticated and powerful.",
                "category": "mobile", "tags": ["mobile", "smartphone", "android", "google", "pixel", "tech"],
                "image": "https://images.unsplash.com/photo-1696446702183-cbd13d78e1e7?auto=format&fit=crop&q=80&w=800",
                "rate": 4.7, "count": 210, "is_featured": False
            },
            {
                "id": 204, "title": "OnePlus 12", "price": 799.00, "description": "Smooth Beyond Belief. Powered by Snapdragon 8 Gen 3.",
                "category": "mobile", "tags": ["mobile", "smartphone", "android", "oneplus", "tech"],
                "image": "https://images.unsplash.com/photo-1707153644265-f6284697a48d?auto=format&fit=crop&q=80&w=800",
                "rate": 4.6, "count": 145, "is_featured": False
            },
            {
                "id": 205, "title": "Xiaomi 14 Ultra", "price": 1299.00, "description": "Legendary Leica optics for professional photography.",
                "category": "mobile", "tags": ["mobile", "smartphone", "android", "xiaomi", "tech", "camera"],
                "image": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800",
                "rate": 4.8, "count": 98, "is_featured": False
            },
            # hardware / storage
            {
                "id": 301, "title": "WD Elements 2TB External HDD", "price": 64.99, "description": "Simple, fast, and portable external storage.",
                "category": "hardware", "tags": ["hardware", "storage", "hard drive", "external", "wd", "western digital"],
                "image": "https://images.unsplash.com/photo-1531492746076-1a1bd9b29fc0?auto=format&fit=crop&q=80&w=800",
                "rate": 4.7, "count": 850, "is_featured": True
            },
            {
                "id": 302, "title": "Samsung T7 Shield SSD 1TB", "price": 99.99, "description": "Rugged durability and fast speeds for creators on the move.",
                "category": "hardware", "tags": ["hardware", "storage", "ssd", "external", "samsung", "fast"],
                "image": "https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?auto=format&fit=crop&q=80&w=800",
                "rate": 4.9, "count": 520, "is_featured": True
            },
            {
                "id": 303, "title": "SanDisk Extreme Pro 1TB SSD", "price": 129.99, "description": "Powerful NVMe solid state performance in a portable, high-capacity drive.",
                "category": "hardware", "tags": ["hardware", "storage", "ssd", "external", "sandisk"],
                "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800",
                "rate": 4.8, "count": 310, "is_featured": False
            },
            # fitness / dumbbells
            {
                "id": 401, "title": "Adjustable Dumbbells Set", "price": 349.00, "description": "Space-saving dumbbells that adjust from 5 to 52 lbs.",
                "category": "fitness", "tags": ["fitness", "dumbbells", "gym", "workout", "adjustable"],
                "image": "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&q=80&w=800",
                "rate": 4.8, "count": 1200, "is_featured": True
            },
            {
                "id": 402, "title": "Hex Rubber Dumbbells 20lbs", "price": 59.99, "description": "Durable rubber-coated hex dumbbells for home gym.",
                "category": "fitness", "tags": ["fitness", "dumbbells", "gym", "workout", "hex"],
                "image": "https://images.unsplash.com/photo-1586406472616-b459ad48930d?auto=format&fit=crop&q=80&w=800",
                "rate": 4.7, "count": 450, "is_featured": False
            },
            # laptops
            {
                "id": 501, "title": "MacBook Pro 16", "price": 2499.00, "description": "Powerful M3 Max chip.",
                "category": "electronics", "tags": ["electronics", "laptop", "macbook", "apple", "computer"],
                "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
                "rate": 4.9, "count": 120, "is_featured": True
            },
            {
                "id": 502, "title": "Dell XPS 15", "price": 1899.00, "description": "Stunning 4K OLED display.",
                "category": "electronics", "tags": ["electronics", "laptop", "dell", "windows", "computer"],
                "image": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800",
                "rate": 4.8, "count": 95, "is_featured": False
            },
            # headphones
            {
                "id": 601, "title": "Sony WH-1000XM5", "price": 398.00, "description": "Industry leading noise canceling.",
                "category": "electronics", "tags": ["headphone", "audio", "electronics", "music", "sony", "wireless"],
                "image": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800",
                "rate": 4.8, "count": 420, "is_featured": True
            },
            # jewelery
            {
                "id": 701, "title": "Diamond Engagement Ring", "price": 1299.99, "description": "Classic 14K white gold engagement ring.",
                "category": "jewelery", "tags": ["jewelery", "ring", "diamond", "gold", "accessory"],
                "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
                "rate": 4.9, "count": 85, "is_featured": True
            },
            {
                "id": 702, "title": "Pearl Necklace", "price": 249.00, "description": "Elegant freshwater pearl necklace.",
                "category": "jewelery", "tags": ["jewelery", "necklace", "pearl", "accessory"],
                "image": "https://images.unsplash.com/photo-1535633302703-b0703af6c392?auto=format&fit=crop&q=80&w=800",
                "rate": 4.7, "count": 120, "is_featured": False
            }
        ]

        # 3. Populate database
        for p in products_data:
            cat_obj, _ = Category.objects.get_or_create(
                name=p["category"],
                defaults={"description": f"All kind of {p['category']} products"}
            )
            
            product_obj, created = Product.objects.get_or_create(
                id=p["id"],
                defaults={
                    "name": p["title"],
                    "description": p["description"],
                    "price": p["price"],
                    "image": p["image"],
                    "category": cat_obj,
                    "stock": 50,
                    "sku": f"SKU-{p['id']}",
                    "is_featured": p["is_featured"],
                    "rating": p["rate"],
                    "review_count": p["count"]
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created product '{p['title']}'"))
            else:
                self.stdout.write(f"Product '{p['title']}' already exists")

            # Link tags
            for tag_name in p["tags"]:
                tag_obj, _ = Tag.objects.get_or_create(name=tag_name)
                product_obj.tags.add(tag_obj)

            # Create mock reviews if created
            if created:
                review_comments = [
                    "Excellent product, highly recommended!",
                    "Good value for money.",
                    "Very satisfied with my purchase.",
                    "Fast delivery and great quality.",
                    "Exactly what I was looking for."
                ]
                # Create 3-5 mock reviews
                for i in range(random.randint(3, 5)):
                    user, _ = User.objects.get_or_create(
                        username=f"user_reviewer_{random.randint(100, 999)}",
                        email=f"reviewer_{random.randint(100, 999)}@gmail.com"
                    )
                    Review.objects.create(
                        product=product_obj,
                        user=user,
                        rating=random.randint(4, 5),
                        title="Great item",
                        comment=random.choice(review_comments)
                    )

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))

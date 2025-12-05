from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from restaurants.models import Restaurant, MenuItem
from orders.models import Order, OrderItem
from datetime import timedelta
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate database with comprehensive dummy data (many restaurants, customers, orders)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--flush',
            action='store_true',
            help='Delete all existing data before populating',
        )

    def handle(self, *args, **options):
        flush = options.get('flush')

        if flush:
            self.stdout.write('Flushing existing data...')
            OrderItem.objects.all().delete()
            Order.objects.all().delete()
            MenuItem.objects.all().delete()
            Restaurant.objects.all().delete()
            User.objects.filter(role__in=['CUSTOMER', 'RIDER', 'RESTAURANT_OWNER']).delete()

        self.stdout.write('Creating users...')
        users = {}

        # 10 Restaurant Owners
        owners_data = [
            {'email': 'la_pizza_owner@example.com', 'first_name': 'Luigi', 'last_name': 'Rossi', 'role': 'RESTAURANT_OWNER'},
            {'email': 'sushi_owner@example.com', 'first_name': 'Sakura', 'last_name': 'Tanaka', 'role': 'RESTAURANT_OWNER'},
            {'email': 'burgerking_owner@example.com', 'first_name': 'Mike', 'last_name': 'Johnson', 'role': 'RESTAURANT_OWNER'},
            {'email': 'thai_delight_owner@example.com', 'first_name': 'Som', 'last_name': 'Chai', 'role': 'RESTAURANT_OWNER'},
            {'email': 'indian_spice_owner@example.com', 'first_name': 'Raj', 'last_name': 'Patel', 'role': 'RESTAURANT_OWNER'},
            {'email': 'chinese_garden_owner@example.com', 'first_name': 'Wei', 'last_name': 'Chen', 'role': 'RESTAURANT_OWNER'},
            {'email': 'malay_kitchen_owner@example.com', 'first_name': 'Ahmad', 'last_name': 'Abdullah', 'role': 'RESTAURANT_OWNER'},
            {'email': 'korean_bbq_owner@example.com', 'first_name': 'Min', 'last_name': 'Park', 'role': 'RESTAURANT_OWNER'},
            {'email': 'western_grill_owner@example.com', 'first_name': 'David', 'last_name': 'Smith', 'role': 'RESTAURANT_OWNER'},
            {'email': 'seafood_paradise_owner@example.com', 'first_name': 'Maria', 'last_name': 'Santos', 'role': 'RESTAURANT_OWNER'},
        ]

        for u in owners_data:
            User.objects.filter(email=u['email']).delete()
            user = User.objects.create_user(
                email=u['email'],
                password='password123',
                first_name=u['first_name'],
                last_name=u['last_name'],
                role=u['role'],
            )
            users[u['email']] = user

        # 15 Customers
        customers_data = [
            {'email': 'johndoe@gmail.com', 'first_name': 'John', 'last_name': 'Doe'},
            {'email': 'janedoe@gmail.com', 'first_name': 'Jane', 'last_name': 'Doe'},
            {'email': 'sarah.wilson@gmail.com', 'first_name': 'Sarah', 'last_name': 'Wilson'},
            {'email': 'michael.tan@gmail.com', 'first_name': 'Michael', 'last_name': 'Tan'},
            {'email': 'emily.chang@gmail.com', 'first_name': 'Emily', 'last_name': 'Chang'},
            {'email': 'daniel.lee@gmail.com', 'first_name': 'Daniel', 'last_name': 'Lee'},
            {'email': 'lisa.kumar@gmail.com', 'first_name': 'Lisa', 'last_name': 'Kumar'},
            {'email': 'james.wong@gmail.com', 'first_name': 'James', 'last_name': 'Wong'},
            {'email': 'amanda.garcia@gmail.com', 'first_name': 'Amanda', 'last_name': 'Garcia'},
            {'email': 'chris.rodriguez@gmail.com', 'first_name': 'Chris', 'last_name': 'Rodriguez'},
            {'email': 'rachel.kim@gmail.com', 'first_name': 'Rachel', 'last_name': 'Kim'},
            {'email': 'kevin.lim@gmail.com', 'first_name': 'Kevin', 'last_name': 'Lim'},
            {'email': 'sophia.martinez@gmail.com', 'first_name': 'Sophia', 'last_name': 'Martinez'},
            {'email': 'ryan.anderson@gmail.com', 'first_name': 'Ryan', 'last_name': 'Anderson'},
            {'email': 'olivia.thompson@gmail.com', 'first_name': 'Olivia', 'last_name': 'Thompson'},
        ]

        for u in customers_data:
            User.objects.filter(email=u['email']).delete()
            user = User.objects.create_user(
                email=u['email'],
                password='password123',
                first_name=u['first_name'],
                last_name=u['last_name'],
                role='CUSTOMER',
            )
            users[u['email']] = user

        # 5 Riders
        riders_data = [
            {'email': 'rider1@example.com', 'first_name': 'Alex', 'last_name': 'Rider'},
            {'email': 'rider2@example.com', 'first_name': 'Ben', 'last_name': 'Swift'},
            {'email': 'rider3@example.com', 'first_name': 'Carlos', 'last_name': 'Speed'},
            {'email': 'rider4@example.com', 'first_name': 'Diana', 'last_name': 'Flash'},
            {'email': 'rider5@example.com', 'first_name': 'Eric', 'last_name': 'Quick'},
        ]

        for u in riders_data:
            User.objects.filter(email=u['email']).delete()
            user = User.objects.create_user(
                email=u['email'],
                password='password123',
                first_name=u['first_name'],
                last_name=u['last_name'],
                role='RIDER',
            )
            users[u['email']] = user

        self.stdout.write('Creating 10 restaurants with menus...')

        # Define 10 restaurants with comprehensive menus
        restaurants_data = [
            {
                'owner': 'la_pizza_owner@example.com',
                'name': 'La Pizza Napolitana',
                'description': 'Authentic Italian wood-fired pizzas with premium ingredients',
                'address': '123 Bukit Bintang, Kuala Lumpur',
                'phone_number': '+60123456789',
                'cuisine_type': 'ITALIAN',
                'rating': 4.7,
                'menu': [
                    {'name': 'Margherita', 'description': 'Classic tomato, mozzarella, basil', 'price': 28.00},
                    {'name': 'Pepperoni', 'description': 'Spicy pepperoni, mozzarella', 'price': 32.00},
                    {'name': 'Quattro Formaggi', 'description': 'Four cheese blend', 'price': 36.00},
                    {'name': 'Truffle Mushroom', 'description': 'Wild mushrooms, truffle oil', 'price': 42.00},
                    {'name': 'Hawaiian', 'description': 'Ham, pineapple, cheese', 'price': 30.00},
                    {'name': 'Carbonara Pasta', 'description': 'Creamy bacon pasta', 'price': 24.00},
                    {'name': 'Lasagna', 'description': 'Layered meat lasagna', 'price': 28.00},
                    {'name': 'Tiramisu', 'description': 'Coffee-flavored dessert', 'price': 15.00},
                ]
            },
            {
                'owner': 'sushi_owner@example.com',
                'name': 'Sakura Sushi House',
                'description': 'Fresh Japanese sushi and sashimi by master chefs',
                'address': '456 Petaling Jaya',
                'phone_number': '+60123456788',
                'cuisine_type': 'JAPANESE',
                'rating': 4.8,
                'menu': [
                    {'name': 'Salmon Nigiri', 'description': 'Fresh salmon (2pcs)', 'price': 18.00},
                    {'name': 'Tuna Sashimi', 'description': 'Premium tuna slices (5pcs)', 'price': 25.00},
                    {'name': 'California Roll', 'description': 'Crab, avocado roll (8pcs)', 'price': 22.00},
                    {'name': 'Dragon Roll', 'description': 'Eel and avocado (8pcs)', 'price': 30.00},
                    {'name': 'Rainbow Roll', 'description': 'Assorted fish roll (8pcs)', 'price': 32.00},
                    {'name': 'Tempura Udon', 'description': 'Noodles with tempura', 'price': 26.00},
                    {'name': 'Teriyaki Chicken', 'description': 'Grilled chicken with rice', 'price': 22.00},
                    {'name': 'Miso Soup', 'description': 'Traditional soup', 'price': 6.00},
                ]
            },
            {
                'owner': 'burgerking_owner@example.com',
                'name': 'Burger Haven',
                'description': 'Juicy gourmet burgers and crispy fries',
                'address': '789 KLCC, Kuala Lumpur',
                'phone_number': '+60123456787',
                'cuisine_type': 'FAST_FOOD',
                'rating': 4.5,
                'menu': [
                    {'name': 'Classic Beef Burger', 'description': 'Beef patty, lettuce, tomato', 'price': 18.00},
                    {'name': 'Cheese Burger', 'description': 'Double cheese, beef patty', 'price': 22.00},
                    {'name': 'Chicken Burger', 'description': 'Crispy chicken fillet', 'price': 20.00},
                    {'name': 'Veggie Burger', 'description': 'Plant-based patty', 'price': 19.00},
                    {'name': 'French Fries', 'description': 'Crispy golden fries', 'price': 8.00},
                    {'name': 'Onion Rings', 'description': 'Beer-battered rings', 'price': 10.00},
                    {'name': 'Milkshake', 'description': 'Chocolate/Vanilla/Strawberry', 'price': 12.00},
                ]
            },
            {
                'owner': 'thai_delight_owner@example.com',
                'name': 'Thai Delight',
                'description': 'Authentic Thai flavors with a modern twist',
                'address': '321 Bangsar, Kuala Lumpur',
                'phone_number': '+60123456786',
                'cuisine_type': 'THAI',
                'rating': 4.6,
                'menu': [
                    {'name': 'Pad Thai', 'description': 'Stir-fried rice noodles', 'price': 20.00},
                    {'name': 'Tom Yum Soup', 'description': 'Spicy sour soup', 'price': 18.00},
                    {'name': 'Green Curry', 'description': 'Creamy coconut curry', 'price': 24.00},
                    {'name': 'Massaman Curry', 'description': 'Rich peanut curry', 'price': 26.00},
                    {'name': 'Som Tam', 'description': 'Papaya salad', 'price': 15.00},
                    {'name': 'Thai Fried Rice', 'description': 'Wok-fried rice', 'price': 17.00},
                    {'name': 'Mango Sticky Rice', 'description': 'Sweet dessert', 'price': 12.00},
                ]
            },
            {
                'owner': 'indian_spice_owner@example.com',
                'name': 'Spice of India',
                'description': 'Traditional Indian curries and tandoori specialties',
                'address': '555 Brickfields, Kuala Lumpur',
                'phone_number': '+60123456785',
                'cuisine_type': 'INDIAN',
                'rating': 4.7,
                'menu': [
                    {'name': 'Butter Chicken', 'description': 'Creamy tomato curry', 'price': 26.00},
                    {'name': 'Tandoori Chicken', 'description': 'Clay oven roasted', 'price': 28.00},
                    {'name': 'Biryani Rice', 'description': 'Fragrant spiced rice', 'price': 22.00},
                    {'name': 'Palak Paneer', 'description': 'Spinach and cheese curry', 'price': 20.00},
                    {'name': 'Naan Bread', 'description': 'Garlic/Plain/Butter', 'price': 6.00},
                    {'name': 'Samosa', 'description': 'Crispy pastry (3pcs)', 'price': 10.00},
                    {'name': 'Mango Lassi', 'description': 'Yogurt drink', 'price': 8.00},
                ]
            },
            {
                'owner': 'chinese_garden_owner@example.com',
                'name': 'Golden Dragon Chinese',
                'description': 'Traditional Cantonese and Szechuan cuisine',
                'address': '888 Cheras, Kuala Lumpur',
                'phone_number': '+60123456784',
                'cuisine_type': 'CHINESE',
                'rating': 4.6,
                'menu': [
                    {'name': 'Sweet & Sour Pork', 'description': 'Crispy pork in sauce', 'price': 24.00},
                    {'name': 'Kung Pao Chicken', 'description': 'Spicy stir-fry', 'price': 22.00},
                    {'name': 'Fried Rice', 'description': 'Yang Chow style', 'price': 16.00},
                    {'name': 'Spring Rolls', 'description': 'Crispy rolls (4pcs)', 'price': 12.00},
                    {'name': 'Dim Sum Platter', 'description': 'Assorted dumplings', 'price': 28.00},
                    {'name': 'Hot & Sour Soup', 'description': 'Spicy tangy soup', 'price': 14.00},
                    {'name': 'Peking Duck', 'description': 'Crispy roasted duck', 'price': 45.00},
                ]
            },
            {
                'owner': 'malay_kitchen_owner@example.com',
                'name': 'Warung Pak Ali',
                'description': 'Authentic Malay home-style cooking',
                'address': '777 Kampung Baru, KL',
                'phone_number': '+60123456783',
                'cuisine_type': 'MALAY',
                'rating': 4.8,
                'menu': [
                    {'name': 'Nasi Lemak', 'description': 'Coconut rice set', 'price': 15.00},
                    {'name': 'Rendang Beef', 'description': 'Slow-cooked curry', 'price': 25.00},
                    {'name': 'Satay', 'description': 'Grilled skewers (10pcs)', 'price': 18.00},
                    {'name': 'Mee Goreng', 'description': 'Fried noodles', 'price': 14.00},
                    {'name': 'Roti Canai', 'description': 'Flatbread with curry', 'price': 8.00},
                    {'name': 'Laksa', 'description': 'Spicy noodle soup', 'price': 16.00},
                    {'name': 'Teh Tarik', 'description': 'Pulled milk tea', 'price': 5.00},
                ]
            },
            {
                'owner': 'korean_bbq_owner@example.com',
                'name': 'Seoul BBQ House',
                'description': 'Korean BBQ and authentic banchan sides',
                'address': '999 Mont Kiara, KL',
                'phone_number': '+60123456782',
                'cuisine_type': 'KOREAN',
                'rating': 4.9,
                'menu': [
                    {'name': 'Beef Bulgogi', 'description': 'Marinated beef BBQ', 'price': 32.00},
                    {'name': 'Pork Belly BBQ', 'description': 'Samgyupsal set', 'price': 30.00},
                    {'name': 'Bibimbap', 'description': 'Mixed rice bowl', 'price': 22.00},
                    {'name': 'Kimchi Jjigae', 'description': 'Kimchi stew', 'price': 20.00},
                    {'name': 'Korean Fried Chicken', 'description': 'Crispy wings', 'price': 24.00},
                    {'name': 'Tteokbokki', 'description': 'Spicy rice cakes', 'price': 16.00},
                    {'name': 'Japchae', 'description': 'Stir-fried noodles', 'price': 18.00},
                ]
            },
            {
                'owner': 'western_grill_owner@example.com',
                'name': 'The Western Grill',
                'description': 'Premium steaks and grilled specialties',
                'address': '111 Pavilion KL',
                'phone_number': '+60123456781',
                'cuisine_type': 'WESTERN',
                'rating': 4.7,
                'menu': [
                    {'name': 'Ribeye Steak', 'description': '300g Australian beef', 'price': 65.00},
                    {'name': 'Sirloin Steak', 'description': '250g premium cut', 'price': 55.00},
                    {'name': 'Grilled Salmon', 'description': 'Atlantic salmon fillet', 'price': 42.00},
                    {'name': 'Lamb Chops', 'description': 'New Zealand lamb', 'price': 58.00},
                    {'name': 'Caesar Salad', 'description': 'Classic romaine salad', 'price': 18.00},
                    {'name': 'Mushroom Soup', 'description': 'Creamy soup', 'price': 14.00},
                    {'name': 'Chocolate Lava Cake', 'description': 'Warm dessert', 'price': 16.00},
                ]
            },
            {
                'owner': 'seafood_paradise_owner@example.com',
                'name': 'Ocean Paradise Seafood',
                'description': 'Fresh seafood daily catch and local favorites',
                'address': '222 Port Klang',
                'phone_number': '+60123456780',
                'cuisine_type': 'SEAFOOD',
                'rating': 4.6,
                'menu': [
                    {'name': 'Grilled Tiger Prawns', 'description': 'Butter garlic prawns', 'price': 38.00},
                    {'name': 'Chili Crab', 'description': 'Singaporean style crab', 'price': 55.00},
                    {'name': 'Fish & Chips', 'description': 'Battered fish with fries', 'price': 28.00},
                    {'name': 'Seafood Platter', 'description': 'Mixed seafood selection', 'price': 75.00},
                    {'name': 'Clam Chowder', 'description': 'Creamy soup', 'price': 16.00},
                    {'name': 'Calamari Rings', 'description': 'Crispy fried squid', 'price': 22.00},
                    {'name': 'Lobster Thermidor', 'description': 'Baked lobster', 'price': 88.00},
                ]
            },
        ]

        restaurants = {}
        for r_data in restaurants_data:
            owner_email = r_data.pop('owner')
            menu_items = r_data.pop('menu')
            
            restaurant, _ = Restaurant.objects.get_or_create(
                owner=users[owner_email],
                defaults={
                    'name': r_data['name'],
                    'description': r_data['description'],
                    'address': r_data['address'],
                    'phone_number': r_data['phone_number'],
                    'cuisine_type': r_data['cuisine_type'],
                }
            )
            restaurants[r_data['name']] = restaurant

            # Create menu items
            for item_data in menu_items:
                MenuItem.objects.get_or_create(
                    restaurant=restaurant,
                    name=item_data['name'],
                    defaults={
                        'description': item_data['description'],
                        'price': item_data['price'],
                        'is_available': True,
                    }
                )

        self.stdout.write('Creating 40+ realistic orders...')

        # Create many orders with varied statuses and timestamps
        now = timezone.now()
        statuses = ['PENDING', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']
        
        customer_emails = [u['email'] for u in customers_data]
        rider_emails = [u['email'] for u in riders_data]
        restaurant_list = list(restaurants.values())

        # Create 45 orders spanning the last 7 days
        for i in range(45):
            # Random customer and restaurant
            customer = users[random.choice(customer_emails)]
            restaurant = random.choice(restaurant_list)
            rider = users[random.choice(rider_emails)] if i % 3 != 0 else None  # Not all orders have riders yet
            
            # Determine status based on age of order
            days_ago = random.randint(0, 7)
            hours_ago = random.randint(0, 23)
            minutes_ago = random.randint(0, 59)
            
            if days_ago >= 2:
                status = random.choice(['DELIVERED', 'CANCELLED'])
            elif days_ago == 1:
                status = random.choice(['DELIVERED', 'OUT_FOR_DELIVERY', 'CANCELLED'])
            elif hours_ago >= 2:
                status = random.choice(['DELIVERED', 'OUT_FOR_DELIVERY', 'READY_FOR_PICKUP'])
            elif hours_ago >= 1:
                status = random.choice(['OUT_FOR_DELIVERY', 'READY_FOR_PICKUP', 'PREPARING'])
            else:
                status = random.choice(['PREPARING', 'PENDING'])

            created_at = now - timedelta(days=days_ago, hours=hours_ago, minutes=minutes_ago)
            
            # Get 1-3 random menu items from this restaurant
            menu_items = list(MenuItem.objects.filter(restaurant=restaurant))
            if not menu_items:
                continue
                
            selected_items = random.sample(menu_items, min(random.randint(1, 3), len(menu_items)))
            
            # Create order
            order = Order.objects.create(
                customer=customer,
                restaurant=restaurant,
                delivery_address=f'{random.randint(100, 999)} {random.choice(["Main", "Park", "Lake", "Hill"])} Street, Apt {random.randint(1, 50)}',
                status=status,
                created_at=created_at,
                rider=rider if status in ['OUT_FOR_DELIVERY', 'DELIVERED'] else None,
            )

            # Add order items
            for item in selected_items:
                OrderItem.objects.create(
                    order=order,
                    menu_item=item,
                    quantity=random.randint(1, 3),
                    price_at_order=item.price,
                )

            # Set timestamps based on status
            if status in ['PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED']:
                order.prepared_at = created_at + timedelta(minutes=random.randint(10, 25))
            
            if status in ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED']:
                order.prepared_at = created_at + timedelta(minutes=random.randint(10, 20))
            
            if status in ['OUT_FOR_DELIVERY', 'DELIVERED']:
                order.picked_up_at = order.prepared_at + timedelta(minutes=random.randint(5, 15))
            
            if status == 'DELIVERED':
                order.delivered_at = order.picked_up_at + timedelta(minutes=random.randint(15, 35))
            
            if status == 'CANCELLED':
                order.cancelled_at = created_at + timedelta(minutes=random.randint(1, 10))
                order.cancellation_reason = random.choice([
                    'Customer changed mind',
                    'Restaurant too busy',
                    'Incorrect order details',
                    'Delivery address issue'
                ])

            order.total_amount = order.calculate_total()
            order.save()

        self.stdout.write(self.style.SUCCESS('✓ Database populated with comprehensive data!'))
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(restaurants)} restaurants with diverse menus'))
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(customer_emails)} customers'))
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(rider_emails)} riders'))
        self.stdout.write(self.style.SUCCESS(f'✓ Created 45+ orders with varied statuses'))
        self.stdout.write(self.style.SUCCESS('✓ Platform looks like a thriving business!'))

from django.core.management.base import BaseCommand
from django.utils import timezone

from django.contrib.auth import get_user_model

from restaurants.models import Restaurant, MenuItem
from orders.models import Order, OrderItem

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate the database with dummy data for testing (users, restaurants, menu items, orders)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--flush',
            action='store_true',
            help='Delete previously created sample data before populating',
        )

    def handle(self, *args, **options):
        flush = options.get('flush')

        if flush:
            self.stdout.write('Flushing existing sample data...')
            OrderItem.objects.all().delete()
            Order.objects.all().delete()
            MenuItem.objects.all().delete()
            Restaurant.objects.all().delete()
            # Do not delete users automatically unless they were created by this script.

        self.stdout.write('Creating users...')

        # Create users
        users = {}

        # Owners (10 restaurant owners)
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
            # Delete existing user if exists, then create fresh
            User.objects.filter(email=u['email']).delete()
            user = User.objects.create_user(
                email=u['email'],
                password='password123',
                first_name=u['first_name'],
                last_name=u['last_name'],
                role=u['role'],
            )
            users[u['email']] = user

        # Customers (15 customers for a busy platform)
        customers_data = [
            {'email': 'johndoe@gmail.com', 'first_name': 'John', 'last_name': 'Doe', 'role': 'CUSTOMER'},
            {'email': 'janedoe@gmail.com', 'first_name': 'Jane', 'last_name': 'Doe', 'role': 'CUSTOMER'},
            {'email': 'sarah.wilson@gmail.com', 'first_name': 'Sarah', 'last_name': 'Wilson', 'role': 'CUSTOMER'},
            {'email': 'michael.tan@gmail.com', 'first_name': 'Michael', 'last_name': 'Tan', 'role': 'CUSTOMER'},
            {'email': 'emily.chang@gmail.com', 'first_name': 'Emily', 'last_name': 'Chang', 'role': 'CUSTOMER'},
            {'email': 'daniel.lee@gmail.com', 'first_name': 'Daniel', 'last_name': 'Lee', 'role': 'CUSTOMER'},
            {'email': 'lisa.kumar@gmail.com', 'first_name': 'Lisa', 'last_name': 'Kumar', 'role': 'CUSTOMER'},
            {'email': 'james.wong@gmail.com', 'first_name': 'James', 'last_name': 'Wong', 'role': 'CUSTOMER'},
            {'email': 'amanda.garcia@gmail.com', 'first_name': 'Amanda', 'last_name': 'Garcia', 'role': 'CUSTOMER'},
            {'email': 'chris.rodriguez@gmail.com', 'first_name': 'Chris', 'last_name': 'Rodriguez', 'role': 'CUSTOMER'},
            {'email': 'rachel.kim@gmail.com', 'first_name': 'Rachel', 'last_name': 'Kim', 'role': 'CUSTOMER'},
            {'email': 'kevin.lim@gmail.com', 'first_name': 'Kevin', 'last_name': 'Lim', 'role': 'CUSTOMER'},
            {'email': 'sophia.martinez@gmail.com', 'first_name': 'Sophia', 'last_name': 'Martinez', 'role': 'CUSTOMER'},
            {'email': 'ryan.anderson@gmail.com', 'first_name': 'Ryan', 'last_name': 'Anderson', 'role': 'CUSTOMER'},
            {'email': 'olivia.thompson@gmail.com', 'first_name': 'Olivia', 'last_name': 'Thompson', 'role': 'CUSTOMER'},
        ]
        for u in customers_data:
            # Delete existing user if exists, then create fresh
            User.objects.filter(email=u['email']).delete()
            user = User.objects.create_user(
                email=u['email'],
                password='password123',
                first_name=u['first_name'],
                last_name=u['last_name'],
                role=u['role'],
            )
            users[u['email']] = user

        # Riders (5 delivery riders for busy operations)
        riders_data = [
            {'email': 'rider1@example.com', 'first_name': 'Alex', 'last_name': 'Rider', 'role': 'RIDER'},
            {'email': 'rider2@example.com', 'first_name': 'Ben', 'last_name': 'Swift', 'role': 'RIDER'},
            {'email': 'rider3@example.com', 'first_name': 'Carlos', 'last_name': 'Speed', 'role': 'RIDER'},
            {'email': 'rider4@example.com', 'first_name': 'Diana', 'last_name': 'Flash', 'role': 'RIDER'},
            {'email': 'rider5@example.com', 'first_name': 'Eric', 'last_name': 'Quick', 'role': 'RIDER'},
        ]
        for u in riders_data:
            # Delete existing user if exists, then create fresh
            User.objects.filter(email=u['email']).delete()
            user = User.objects.create_user(
                email=u['email'],
                password='password123',
                first_name=u['first_name'],
                last_name=u['last_name'],
                role=u['role'],
            )
            users[u['email']] = user

        self.stdout.write('Creating restaurants and menu items...')

        # Restaurant 1 - La Pizza
        owner1 = users['la_pizza_owner@example.com']
        r1, created = Restaurant.objects.get_or_create(
            owner=owner1,
            defaults={
                'name': "La Pizza",
                'description': 'Classic wood-fired pizzas and Italian favorites.',
                'address': '123 Pizza Street, Food City',
                'phone_number': '+1 555 111 2222',
                'cuisine_type': 'ITALIAN',
            }
        )

        pizza_items = [
            {'name': 'Margherita', 'description': 'Tomato, mozzarella, basil', 'price': 9.99, 'category': 'Pizza', 'is_available': True},
            {'name': 'Pepperoni', 'description': 'Spicy pepperoni, mozzarella', 'price': 11.99, 'category': 'Pizza', 'is_available': True},
            {'name': 'Truffle Mushroom', 'description': 'Seasonal mushrooms, truffle oil', 'price': 13.50, 'category': 'Specials', 'is_available': True},
        ]
        for item in pizza_items:
            MenuItem.objects.get_or_create(restaurant=r1, name=item['name'], defaults={
                'description': item['description'],
                'price': item['price'],
                'category': item['category'],
                'is_available': item['is_available'],
            })

        # Restaurant 2 - Sushi Place
        owner2 = users['sushi_owner@example.com']
        r2, created = Restaurant.objects.get_or_create(
            owner=owner2,
            defaults={
                'name': "Sakura Sushi",
                'description': 'Fresh sushi and sashimi with a modern twist.',
                'address': '77 Sashimi Ave, Food City',
                'phone_number': '+1 555 333 4444',
                'cuisine_type': 'JAPANESE',
            }
        )

        sushi_items = [
            {'name': 'Salmon Nigiri', 'description': 'Fresh salmon over rice', 'price': 4.50, 'category': 'Nigiri', 'is_available': True},
            {'name': 'Tuna Roll', 'description': 'Tuna and avocado roll', 'price': 8.50, 'category': 'Rolls', 'is_available': True},
            {'name': 'Veggie Roll', 'description': 'Cucumber, avocado, carrot', 'price': 7.00, 'category': 'Vegetarian', 'is_available': True},
        ]
        for item in sushi_items:
            MenuItem.objects.get_or_create(restaurant=r2, name=item['name'], defaults={
                'description': item['description'],
                'price': item['price'],
                'category': item['category'],
                'is_available': item['is_available'],
            })

        self.stdout.write('Creating sample orders...')

        # Create orders for customers
        customer1 = users['johndoe@gmail.com']
        customer2 = users['janedoe@gmail.com']
        rider = users.get('rider1@example.com')

        # Get menu items
        margherita = MenuItem.objects.filter(restaurant=r1, name='Margherita').first()
        pepperoni = MenuItem.objects.filter(restaurant=r1, name='Pepperoni').first()
        truffle = MenuItem.objects.filter(restaurant=r1, name='Truffle Mushroom').first()
        salmon = MenuItem.objects.filter(restaurant=r2, name='Salmon Nigiri').first()
        tuna = MenuItem.objects.filter(restaurant=r2, name='Tuna Roll').first()
        veggie = MenuItem.objects.filter(restaurant=r2, name='Veggie Roll').first()

        from datetime import timedelta
        now = timezone.now()

        # Order 1: DELIVERED - John ordered pizza 2 days ago
        if margherita and pepperoni:
            order1 = Order.objects.create(
                customer=customer1,
                restaurant=r1,
                delivery_address='456 Customer Lane, Apt 2',
                status='DELIVERED',
                created_at=now - timedelta(days=2),
            )
            OrderItem.objects.create(order=order1, menu_item=margherita, quantity=1, price_at_order=margherita.price)
            OrderItem.objects.create(order=order1, menu_item=pepperoni, quantity=1, price_at_order=pepperoni.price)
            order1.total_amount = order1.calculate_total()
            order1.rider = rider
            order1.prepared_at = order1.created_at + timedelta(minutes=15)
            order1.picked_up_at = order1.prepared_at + timedelta(minutes=5)
            order1.delivered_at = order1.picked_up_at + timedelta(minutes=20)
            order1.save()

        # Order 2: OUT_FOR_DELIVERY - Jane ordered sushi 1 hour ago
        if tuna:
            order2 = Order.objects.create(
                customer=customer2,
                restaurant=r2,
                delivery_address='789 Example Road, Suite 5',
                status='OUT_FOR_DELIVERY',
                created_at=now - timedelta(hours=1),
            )
            OrderItem.objects.create(order=order2, menu_item=tuna, quantity=2, price_at_order=tuna.price)
            order2.total_amount = order2.calculate_total()
            order2.rider = rider
            order2.prepared_at = order2.created_at + timedelta(minutes=20)
            order2.picked_up_at = order2.prepared_at + timedelta(minutes=5)
            order2.save()

        # Order 3: READY_FOR_PICKUP - John's second order from Pizza (30 mins ago)
        if truffle and margherita:
            order3 = Order.objects.create(
                customer=customer1,
                restaurant=r1,
                delivery_address='456 Customer Lane, Apt 2',
                status='READY_FOR_PICKUP',
                created_at=now - timedelta(minutes=30),
            )
            OrderItem.objects.create(order=order3, menu_item=truffle, quantity=1, price_at_order=truffle.price)
            OrderItem.objects.create(order=order3, menu_item=margherita, quantity=2, price_at_order=margherita.price)
            order3.total_amount = order3.calculate_total()
            order3.prepared_at = order3.created_at + timedelta(minutes=18)
            order3.save()

        # Order 4: PREPARING - Jane's sushi order (10 mins ago)
        if salmon and veggie:
            order4 = Order.objects.create(
                customer=customer2,
                restaurant=r2,
                delivery_address='789 Example Road, Suite 5',
                status='PREPARING',
                created_at=now - timedelta(minutes=10),
            )
            OrderItem.objects.create(order=order4, menu_item=salmon, quantity=3, price_at_order=salmon.price)
            OrderItem.objects.create(order=order4, menu_item=veggie, quantity=1, price_at_order=veggie.price)
            order4.total_amount = order4.calculate_total()
            order4.save()

        # Order 5: PENDING - John just placed an order (2 mins ago)
        if pepperoni and truffle:
            order5 = Order.objects.create(
                customer=customer1,
                restaurant=r1,
                delivery_address='456 Customer Lane, Apt 2',
                status='PENDING',
                created_at=now - timedelta(minutes=2),
            )
            OrderItem.objects.create(order=order5, menu_item=pepperoni, quantity=2, price_at_order=pepperoni.price)
            OrderItem.objects.create(order=order5, menu_item=truffle, quantity=1, price_at_order=truffle.price)
            order5.total_amount = order5.calculate_total()
            order5.save()

        # Order 6: CANCELLED - Jane cancelled sushi order (yesterday)
        if tuna and salmon:
            order6 = Order.objects.create(
                customer=customer2,
                restaurant=r2,
                delivery_address='789 Example Road, Suite 5',
                status='CANCELLED',
                created_at=now - timedelta(days=1),
            )
            OrderItem.objects.create(order=order6, menu_item=tuna, quantity=1, price_at_order=tuna.price)
            OrderItem.objects.create(order=order6, menu_item=salmon, quantity=2, price_at_order=salmon.price)
            order6.total_amount = order6.calculate_total()
            order6.cancelled_at = order6.created_at + timedelta(minutes=3)
            order6.cancellation_reason = 'Customer changed mind'
            order6.save()

        self.stdout.write(self.style.SUCCESS('✓ Database populated with sample data.'))
        self.stdout.write(self.style.SUCCESS('✓ Created 2 restaurants with menu items'))
        self.stdout.write(self.style.SUCCESS('✓ Created 5 users (2 owners, 2 customers, 1 rider)'))
        self.stdout.write(self.style.SUCCESS('✓ Created 6 orders with various statuses'))

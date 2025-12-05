from django.core.management.base import BaseCommand
from users.models import CustomUser


class Command(BaseCommand):
    help = 'Creates a superuser with predefined credentials for testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            default='admin@example.com',
            help='Email for the superuser (default: admin@example.com)'
        )
        parser.add_argument(
            '--password',
            type=str,
            default='admin123',
            help='Password for the superuser (default: admin123)'
        )

    def handle(self, *args, **options):
        email = options['email']
        password = options['password']

        # Check if user with this email already exists
        existing_user = CustomUser.objects.filter(email=email).first()
        
        if existing_user:
            if existing_user.is_superuser:
                self.stdout.write(
                    self.style.WARNING(f'✓ Superuser with email {email} already exists.')
                )
                self.stdout.write(f'  Email: {email}')
                self.stdout.write(f'  Password: {password}')
                self.stdout.write(f'  Access Django Admin at: http://localhost:8000/admin/')
                return
            else:
                # User exists but is not a superuser, upgrade them
                existing_user.is_staff = True
                existing_user.is_superuser = True
                existing_user.role = 'ADMIN'
                existing_user.set_password(password)
                existing_user.save()
                
                self.stdout.write(
                    self.style.SUCCESS(f'✓ User {email} upgraded to superuser!')
                )
                self.stdout.write(f'  Email: {email}')
                self.stdout.write(f'  Password: {password}')
                self.stdout.write(f'  Access Django Admin at: http://localhost:8000/admin/')
                return

        # Create superuser
        user = CustomUser.objects.create_user(
            email=email,
            password=password,
            first_name='Admin',
            last_name='User',
            role='ADMIN',
        )
        user.is_staff = True
        user.is_superuser = True
        user.save()

        self.stdout.write(
            self.style.SUCCESS(f'✓ Superuser created successfully!')
        )
        self.stdout.write(f'  Email: {email}')
        self.stdout.write(f'  Password: {password}')
        self.stdout.write(f'  Access Django Admin at: http://localhost:8000/admin/')

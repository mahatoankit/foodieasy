# Complete Food Ordering Lifecycle Test

## Test Date: December 7, 2025

### Test Accounts (from DUMMY_DATA.md)
- **Customer**: johndoe@gmail.com / password123
- **Restaurant Owner**: momohouse@gmail.com / password123 (Himalayan Momo House)
- **Rider**: ram.rider@gmail.com / password123 (Ram Bahadur)

---

## 🔄 Complete Order Flow

### Status Progression:
1. **PENDING** → Customer places order
2. **PREPARING** → Restaurant accepts and starts cooking
3. **READY_FOR_PICKUP** → Restaurant marks food ready
4. **OUT_FOR_DELIVERY** → Rider picks up and starts delivery
5. **DELIVERED** → Rider completes delivery

---

## 📋 Test Steps

### Phase 1: Customer Places Order (PENDING)

**Login as Customer:**
- URL: http://localhost:3000/login
- Email: johndoe@gmail.com
- Password: password123

**Steps:**
1. ✅ Browse restaurants
2. ✅ Click on "Himalayan Momo House"
3. ✅ Add items to cart:
   - Chicken Momo (Steam) - NPR 180
   - Buff Momo (Jhol) - NPR 220
4. ✅ Click "View Cart"
5. ✅ Enter delivery address: "Thamel, Kathmandu, Nepal"
6. ✅ Click "Place Order"
7. ✅ Verify order total includes:
   - Subtotal: NPR 400
   - Delivery Fee: NPR 50
   - Service Fee: NPR 30
   - **Total: NPR 480**

**Expected Result:**
- ✅ Order created with status: PENDING
- ✅ Currency displays as NPR (not $)
- ✅ Order appears in Customer's "My Orders" page

---

### Phase 2: Restaurant Accepts & Prepares (PREPARING)

**Login as Restaurant Owner:**
- URL: http://localhost:3000/login
- Email: momohouse@gmail.com
- Password: password123

**Steps:**
1. ✅ Navigate to Owner Dashboard
2. ✅ Go to "Orders" tab
3. ✅ Find the new PENDING order
4. ✅ Verify order details:
   - Customer: johndoe@gmail.com
   - Items: 2 items (Chicken Momo Steam, Buff Momo Jhol)
   - Total: NPR 480
5. ✅ Click "Accept" button

**Expected Result:**
- ✅ Order status changes to: PREPARING
- ✅ "Accept" and "Reject" buttons disappear
- ✅ "Mark Ready" button appears
- ✅ Order shows in customer's "My Orders" as PREPARING

---

### Phase 3: Restaurant Marks Ready (READY_FOR_PICKUP)

**Still logged in as Restaurant Owner:**

**Steps:**
1. ✅ Find the PREPARING order
2. ✅ Click "Mark Ready" button

**Expected Result:**
- ✅ Order status changes to: READY_FOR_PICKUP
- ✅ "Mark Ready" button disappears
- ✅ Order appears in Rider's "Available Orders"

---

### Phase 4: Rider Accepts & Picks Up (OUT_FOR_DELIVERY)

**Login as Rider:**
- URL: http://localhost:3000/login
- Email: ram.rider@gmail.com
- Password: password123

**Steps:**
1. ✅ Navigate to Rider Dashboard
2. ✅ Go to "Available Orders" tab
3. ✅ Find the READY_FOR_PICKUP order
4. ✅ Verify order details:
   - Restaurant: Himalayan Momo House
   - Address: Thamel, Kathmandu
   - Delivery Fee: NPR 50
5. ✅ Click "Accept Order" button
6. ✅ Order moves to "Active Deliveries" tab
7. ✅ Click "Mark as Picked Up" button

**Expected Result:**
- ✅ Order status changes to: OUT_FOR_DELIVERY
- ✅ Order shows in customer's "My Orders" as OUT_FOR_DELIVERY
- ✅ Rider's stats update (Active Deliveries count increases)

---

### Phase 5: Rider Completes Delivery (DELIVERED)

**Still logged in as Rider:**

**Steps:**
1. ✅ Find the OUT_FOR_DELIVERY order in "Active Deliveries"
2. ✅ Click "Mark as Delivered" button

**Expected Result:**
- ✅ Order status changes to: DELIVERED
- ✅ Order moves to "History" tab
- ✅ Rider's earnings update (+NPR 50 delivery fee)
- ✅ Customer sees order as DELIVERED in "My Orders"

---

### Phase 6: Verify Complete Lifecycle

**Verify as Customer (johndoe@gmail.com):**
1. ✅ Check "My Orders" page
2. ✅ Order shows status: DELIVERED
3. ✅ All currency displayed in NPR

**Verify as Restaurant Owner (momohouse@gmail.com):**
1. ✅ Order shows status: DELIVERED
2. ✅ Order moves to completed orders
3. ✅ Restaurant earnings updated

**Verify as Rider (ram.rider@gmail.com):**
1. ✅ Order shows in "History" tab
2. ✅ Earnings show +NPR 50
3. ✅ Total earnings updated

---

## 🐛 Bugs Fixed During Testing

1. ✅ **Mark Ready Button**: Changed status from 'READY' to 'READY_FOR_PICKUP'
2. ✅ **Status Colors**: Added READY_FOR_PICKUP and OUT_FOR_DELIVERY to color mapping
3. ✅ **Currency Display**: All $ changed to NPR throughout application

---

## 📊 Test Results

| Phase | Status | Notes |
|-------|--------|-------|
| Customer Order | ⏳ Pending | To be tested |
| Owner Accept | ⏳ Pending | To be tested |
| Owner Mark Ready | ⏳ Pending | Button fixed |
| Rider Accept | ⏳ Pending | To be tested |
| Rider Pickup | ⏳ Pending | To be tested |
| Rider Deliver | ⏳ Pending | To be tested |
| End-to-End | ⏳ Pending | Full flow test |

---

## 🚀 Quick Test Commands

### Start Backend:
```bash
cd backend
source env/bin/activate
python manage.py runserver
```

### Start Frontend:
```bash
cd frontend
npm start
```

### Check if test data exists:
```bash
cd backend
source env/bin/activate
python manage.py shell
```

```python
from users.models import User
User.objects.filter(email__in=['johndoe@gmail.com', 'momohouse@gmail.com', 'ram.rider@gmail.com']).values('email', 'role')
```

---

## Notes
- All prices in NPR (Nepalese Rupees)
- No decimal places for currency
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

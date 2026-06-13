from faker import Faker
from random import randint
from random import choice

from app.db.database import SessionLocal

from app.models.customer import Customer
from app.models.order import Order

fake = Faker()

db = SessionLocal()

categories = [
    "Fashion",
    "Coffee",
    "Beauty",
    "Electronics"
]

customers = []

for _ in range(100):

    customer = Customer(
        name=fake.name(),
        email=fake.unique.email(),
        phone=fake.phone_number(),
        city=fake.city(),
        total_spend=0
    )

    db.add(customer)

    customers.append(customer)

db.commit()

for customer in customers:
    db.refresh(customer)

for _ in range(500):

    customer = choice(customers)

    amount = randint(100, 10000)

    order = Order(
        customer_id=customer.id,
        amount=amount,
        category=choice(categories)
    )

    customer.total_spend += amount

    db.add(order)

db.commit()

print("100 Customers Added")
print("500 Orders Added")
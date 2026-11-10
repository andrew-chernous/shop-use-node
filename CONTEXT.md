# Shop

A minimal online shop used as a learning project: a signed-in User browses a fixed catalogue of Products and collects them in a Cart. There is no checkout.

## Language

**User**:
A person who has signed in with a Google account. Identified by their Google account, not by a password.
_Avoid_: Customer, account, client

**Product**:
An item offered for sale, with a name and a current Price. The catalogue is fixed and seeded, not editable.
_Avoid_: Item, good, SKU

**Price**:
The current amount charged for one unit of a Product, held as a whole number of cents in a single currency (USD).
_Avoid_: Cost, amount

**Cart**:
The single collection of Cart Items belonging to one User. It comes into existence when the User first adds a Product.
_Avoid_: Basket, bag, order

**Cart Item**:
One Product in a Cart together with its Quantity. A Cart holds at most one Cart Item per Product, and it always shows the Product's current Price.
_Avoid_: Line item, position, entry

**Quantity**:
The number of units of a Product in a Cart Item, from 1 to 10. A Quantity of 0 means the Cart Item does not exist.
_Avoid_: Count, amount

# **Functional Specification**

## **Ընդհանուր նկարագրություն (Overview)**

Նպատակն է ստեղծել **էլեկտրոնիկայի վաճառքի եռալեզու e-commerce վեբ կայք**,  
 որն ունի\`

* լիարժեք public shop  
* customer account system  
* հզոր admin panel  
* պարզ և արագ checkout  
* analytics և վերահսկում

## **1️⃣ ԳԼԽԱՎՈՐ ԷՋ (Home)**

### **Ֆունկցիոնալ պահանջներ**

* Brand Hero/banner Section  
* Reels section  
* Featured Products Section  
  * Ամենավաճառվող կամ ընտրված ապրանքների կարճ ցուցակ  
* Promotions / Special Offers  
  * Ակցիաներ, զեղչեր, հատուկ առաջարկներ  
* “Why Choose Us” Section  
   (3–4 առավելություն)  
  * Երաշխիք  
  * Արագ առաքում  
  * Ապառիկ  
  * Օրիգինալ ապրանքներ  
* Customer Reviews Carousel  
  * Հաճախորդների կարծիքներ  
* Brand Section  
  * Գործընկերներ բրենդների լոգոներ  
* Footer  
  * Կոնտակտային տվյալներ  
  * Սոցիալական հղումներ  
  * Քարտեզ  
  * Կարևոր էջերի հղումներ

## **2️⃣ SHOP ԷՋ (Product Listing)**

### **Ֆունկցիոնալ պահանջներ**

* Ապրանքների ցուցակ՝  
  * Նկար  
  * Անվանում  
  * Հիմնական տեխնիկական հատկանիշներ  
  * Գին  
  * Բրենդի անվանում  
  * “Երաշխիք” badge

* Sorting  
  * Price (ASC / DESC)  
  * Newest  
  * Popular

* Filters  
  * Brand  
  * Price range  
  * Category  
  * Technical specs

## **3️⃣ ԱՊՐԱՆՔԻ ԷՋ (Single Product Page)**

Յուրաքանչյուր ապրանքի էջ պետք է ներառի\`

* Product Gallery  
  * Multiple images  
  * Zoom functionality

* Product Info  
  * Անվանում  
  * Կարճ նկարագրություն  
  * Լիարժեք նկարագրություն

* Technical Specifications Table

* Pricing  
  * Current price  
  * Old price (եթե կա)  
  * Discount display

* Quantity selector

* “Add to Cart” button

* Stock Status  
  * “Առկա է”  
  * “Առկա չէ”

* Related Products

* Reviews Section  
  * Rating  
  * Comments

## **4️⃣ CHECKOUT (Պատվերի ձևակերպում)**

### **Checkout Form Fields**

* Name / Surname  
* Phone number  
* Email  
* Delivery address  
* Additional notes  
* Delivery method  
* Payment method  
* Delivery cost  
* Order total

## 

## **5️⃣ PAYMENT METHODS**

* Card payment  
* Cash payment

## **6️⃣ USER ACCOUNT (Customer Profile)**

### **Ֆունկցիոնալ**

* Registration / Login  
  * Email կամ Phone number  
* Order History  
* Reorder functionality  
* Address management  
* Personal data management

## **7️⃣ ADMIN PANEL (Management System)**

### **7.1 v**

#### **Product Type Logic (CRITICAL)**

Յուրաքանչյուր ապրանք ունի **Product Class**\`

* Retail  
* Wholesale

**Delivery logic**

* Եթե միայն Retail → Delivery via Yandex  
* Եթե Wholesale կամ Mixed cart → Free delivery

### **7.2 Orders Management**

* Orders list  
* Filters by status:

  * New  
  * In process  
  * Delivered  
  * Canceled

* Order details view  
* Order status update  
* Admin comment field

### **7.3 Promotions**

* Promo code management  
* Discounts configuration

### **7.4 Banners & Categories**

* Banner management  
* Categories add / edit

### **7.5 Analytics Dashboard**

#### **Sales Analytics**

* Total orders  
* Total revenue  
* Average order value

#### **Order Status Analytics**

* Orders by status  
* Today / This week / This month

#### **Product Analytics**

* Top 5 best-selling products  
* Least-selling products

#### **Stock Analytics**

* Low stock products  
* Out of stock products

#### **Customer Analytics**

* New customers  
* Repeat orders  
* Top customers by spend

#### **Dashboard Widgets**

* Today’s sales  
* Monthly sales  
* Top product

## **8️⃣ REELS / VIDEO FEED**

* Separate page  
* Vertical video feed  
* Like functionality  
* Mute / Unmute  
* Play / Pause

## **9️⃣ OTHER PAGES & GLOBAL FEATURES**

* About Us  
* Contact Us  
* Brand pages  
* Legal pages

  * Privacy Policy  
  * Terms & Conditions

  * Refund Policy

  * Delivery Policy

* Global Search  
* Wishlist  
* Compare products

## **1️⃣0️⃣ MULTI-LANGUAGE SUPPORT**

* Armenian (Primary)  
* Russian  
* English  

import frappe

def update_price_list():
    item_list = frappe.get_list("Item")
    print(item_list)
    for item in item_list:
        print(item['name'])
        price_list_doc = frappe.new_doc("Item Price")

        price_list_doc.item_code = item['name']
        price_list_doc.price_list = "Wholesale"
        price_list_doc.selling = 1
        price_list_doc.price_list_rate = 1
        try:
            price_list_doc.save()
            frappe.db.commit()
        except Exception as e:
            print(e)
            
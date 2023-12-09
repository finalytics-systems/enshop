import frappe
from enshop.api.item_filters import get_categories_from_group

sitemap = 1
def get_context(context):
    context.no_cache = True
    print("CATEGORIES")
    print(frappe.form_dict)
    if frappe.form_dict:
        context.category = None
        item_group = frappe.form_dict.item_group
        context.item_group =item_group
        category_list = get_categories_from_group(item_group)
        context.category = category_list
        if len(category_list) == 0:
            context.category = None

    else:
        context.category = []

    

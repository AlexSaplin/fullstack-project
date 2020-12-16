from django.contrib import admin
from accounts.models import User
from django.contrib.auth.admin import UserAdmin


class MyUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Additional info',
            {'fields': ('google_id', 'uuid')}),
    )
    readonly_fields = ('uuid', 'model_count', 'balance')
    list_display = ('email', 'first_name', 'last_name', 'model_count', 'balance')

admin.site.register(User, MyUserAdmin)

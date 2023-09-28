from rest_framework import permissions

# Code derived from https://www.django-rest-framework.org/api-guide/permissions/

# Permission for all authenticated users
# Use permissions.IsAuthenticated


# Permission for User
class IsUserCreatorOrAdmin(permissions.BasePermission):
    """Object-level permission to only allow the creator of a User object or an admin to edit it."""

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # request.user calls 
        return obj == request.user or request.user.is_staff

# Permission for record permission control
class IsRecordCreatorOrAdmin(permissions.BasePermission):
    """Object-level permission to only allow the creator of a record object or an admin to edit it."""

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        if request.method in permissions.SAFE_METHODS:
            return True
        # request.user calls 
        return obj.record_creator == request.user or request.user.is_staff

# Permission for comment permission control
class IsCommenterOrAdmin(permissions.BasePermission):
    """Object-level permission to only allow the commenter of a comment object or an admin to edit it."""

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        if request.method in permissions.SAFE_METHODS:
            return True
        # request.user calls 
        return obj.commenter == request.user or request.user.is_staff

# Permission for all ReadOnlyPermission, allow all admins by default
class ReadOnlyPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        return request.method in permissions.SAFE_METHODS 

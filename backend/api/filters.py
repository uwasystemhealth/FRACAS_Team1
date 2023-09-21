from rest_framework.filters import BaseFilterBackend


class KeyValuePairFilter(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        query_params = request.query_params
        for key, value in query_params.items():
            queryset = queryset.filter(**{key: value})
        return queryset

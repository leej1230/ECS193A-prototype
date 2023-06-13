from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views import View
from genomics_browser_django_app_base.database import Database
from genomics_browser_django_app_base.serializers import UserSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import status


class BackendServer(View):
    """
    index function

    ### Params
    @request: The WSGI request object resulting from calling View.as_view() in urls.py.

    ### Returns
    - `JsonResponse`: An object containing the data returned by the dispatched database method.
    """

    def index(request):
        return Response("Hello, world. You're at the poll index.")

    """
    Overload the get() function to dispatch the request to the appropriate database method.

    ### Params
    @request: The WSGI request object resulting from calling View.as_view() in urls.py.

    ### Returns
    - `JsonResponse`: An object containing the data returned by the dispatched database method.
    """

    def get(self, request, **kwargs):
        callback = getattr(
            getattr(Database, kwargs['inner']), kwargs['callback']
        )
        return self.render_to_response(callback)

    """
    Overload the post() function to dispatch the request to the appropriate database method.

    ### Params
    @request: The WSGI request object resulting from calling View.as_view() in urls.py.

    ### Returns
    - `JsonResponse`: An object containing the data returned by the dispatched database method.
    """

    def post(self, request, **kwargs):
        callback = getattr(
            getattr(Database, kwargs['inner']), kwargs['callback']
        )
        self.kwargs.update({'ctx': request})
        return self.render_to_response(callback)

    """
    Overload the render_to_response() function to return a JsonResponse object.

    ### Params
    @callback: The database method object to be called.

    ### Returns
    - `JsonResponse`: An object containing the data returned by the dispatched database method.
    """

    def render_to_response(self, callback, **request_kwargs):
        return self.render_to_json_response(callback, **request_kwargs)

    """
    Overload the render_to_json_response() function to return a JsonResponse object.

    ### Params
    @callback: The database method object to be called.

    ### Returns
    - `JsonResponse`: An object containing the data returned by the dispatched database method.
    """

    def render_to_json_response(self, callback, **request_kwargs):
        try:
            data = callback(self.kwargs)
            status = 200  # OK
            if (
                type(data) == int
            ):  # If the data is an integer, it is a status code.
                status = data
            
            return JsonResponse(
                data, **request_kwargs, safe=False, status=status
            )
        
        except Exception as e:
            return JsonResponse(
                {'error': str(e)}, **request_kwargs, safe=False, status=500
            )

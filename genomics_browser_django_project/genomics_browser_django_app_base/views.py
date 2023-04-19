from genomics_browser_django_app_base.database import Database

from django.views import View
from django.http import JsonResponse

class BackendServer(View):
    """
    Overload the get() function to dispatch the request to the appropriate database method.

    ### Params
    @request: The WSGI request object resulting from calling View.as_view() in urls.py.

    ### Returns
    - `JsonResponse`: An object containing the data returned by the dispatched database method.
    """
    def get(self, request, **kwargs):
        callback = getattr(getattr(Database, kwargs['inner']), kwargs['callback'])
        return self.render_to_response(callback)

    """
    Overload the post() function to dispatch the request to the appropriate database method.

    ### Params
    @request: The WSGI request object resulting from calling View.as_view() in urls.py.

    ### Returns
    - `JsonResponse`: An object containing the data returned by the dispatched database method.
    """
    def post(self, request, **kwargs):
        callback = getattr(getattr(Database, kwargs['inner']), kwargs['callback'])
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
        data = callback(self.kwargs)
        return JsonResponse(data, **request_kwargs, safe=False)
from aiohttp import web
    
def create_handler(handler, **kwargs):
    async def wrapper(request):
        return await handler(request, **kwargs)
    return wrapper

async def get_page_handler(request, path):
    response = web.FileResponse(path)
    return response
    
    

def main():
    app = web.Application()
    app.router.add_get('/', create_handler(get_page_handler, path = '../main-page/index.html'))

    app.router.add_static('/', path='..')
    app.router.add_static('/heat', path='../simulations/heat')
    app.router.add_static('/stableFluids', path='../simulations/stableFluids')
    app.router.add_static('/threeBody', path='../simulations/threeBody')
    app.router.add_static('/wave', path='../simulations/wave')

    web.run_app(app, host='127.0.0.1', port=5252)

if __name__ == '__main__':
    main()
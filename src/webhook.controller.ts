import { Get, Controller, Render, Res, Param, All } from '@nestjs/common';

type RequestType = {
  id: string;
  path: string;
  date: string;
  method: string;
  query: string;
  headers: string;
  body: string;
};

const requests: Record<string, RequestType[]> = {};

const convertToJSON = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
};

const parseObjectProps = (obj: Record<string, string>) => {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = convertToJSON(obj[key]);
    }
  }

  return JSON.stringify(obj);
};

@Controller()
export class WebhookController {
  @Get('app/:id')
  @Render('index')
  root(@Param('id') id: string) {
    return {
      message: 'Meu Webhook Favorito!',
      requests: requests[id] ? requests[id].reverse() : [],
    };
  }

  @All('webhook-test/*')
  test(@Res() request) {
    request.status(200).json({
      path: request.req.params[0],
      method: request.req.method,
      query: request.req.query,
      headers: request.req.headers,
      body: request.req.body,
    });
  }

  @Get('webhook/:id/clear')
  clear(@Param('id') id: string) {
    requests[id] = [];

    return {
      message: 'clear',
    };
  }

  @All('webhook/:id/*')
  saveRequest(@Res() request, @Param('id') id: string) {
    if (!requests[id]) requests[id] = [];

    requests[id].push({
      id,
      path: request.req.params[0],
      date: new Date().toLocaleString(),
      method: request.req.method,
      query: parseObjectProps(request.req.query),
      headers: parseObjectProps(request.req.headers),
      body: parseObjectProps(request.req.body),
    });

    request.end();
  }
}

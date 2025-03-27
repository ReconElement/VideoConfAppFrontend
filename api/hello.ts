import {Request} from "@vercel/functions";
export async function GET(req: Request){
    const url = new URL(req?.url);
    const name = url.searchParams.get('name') || 'World';
    return Response.json({message: `Hello ${name}`});
}

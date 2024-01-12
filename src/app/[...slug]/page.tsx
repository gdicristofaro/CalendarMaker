import dynamic from "next/dynamic";
import { ROUTE_PATHS } from "../model/routes";

export default (props: {params: { slug: string[] }}) => {
  // disable SSR https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#skipping-ssr
  const MainView = dynamic(() => import('../views/mainview'), { ssr: false });

    return (
        <MainView slug={props.params.slug[0]} />
    )
}

export async function generateStaticParams() {
  return ROUTE_PATHS.map(v => ({ slug: [v]}));
}
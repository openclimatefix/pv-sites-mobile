import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import Details from '~/components/form/details';
import Location from '~/components/form/location';
import { useRouter } from 'next/router';

import { FC, useState} from 'react';

enum Page {
    Details = "Details",
    Location = "Location"
}

/*

TODO: add desktop

*/


// const SiteDetailsDesktop
// const [page, setPage] = useState<Page>(Page.Location);


// const SiteDetailsMobile
// const [page, setPage] = useState<Page>(Page.Location);

const SiteDetails: FC = () => {
    const router = useRouter();
    const [page, setPage] = useState<Page>(Page.Location);
    
    // <div>
    //     <div>

    //     </div>
    //     <div>

    //     </div>
    // </div>

    switch (page) {
        case Page.Details:
            return <Details lastPageCallback={() => setPage(Page.Location)} nextPageCallback={() => router.push("sites")}/> 
        case Page.Location:
            return <Location nextPageCallback={() => setPage(Page.Details)}/> 
        default:
            return null;
    }
};



export default SiteDetails;
export const getServerSideProps = withPageAuthRequired();

import { useState } from "react";
import {
    Card,
    Heading,
    TextContainer,
    DisplayText,
    TextStyle,
    Grid
} from "@shopify/polaris";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";


export function HelloCard() {
    const [isLoading, setIsLoading] = useState(true);

    const { data } = useAppQuery({
        url: "/api/getShopInfo",
        reactQueryOptions: {
            onSuccess: (data) => {
                setIsLoading(false);
            },
        },
    });

    return (
        <>

            <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Card title="Shop name" sectioned>
                        <p>{isLoading ? "-" : data.name}</p>
                    </Card>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Card title="Shop email" sectioned>
                        <p>{isLoading ? "-" : data.email}</p>
                    </Card>
                </Grid.Cell>
            </Grid>

        </>
    );
}
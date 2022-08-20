import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
  Badge,
  Subheading,
} from "@shopify/polaris";
import { useState } from "react";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

import { trophyImage, opentrustIcon } from "../assets";

import { ProductsCard, HelloCard } from "../components";

export default function HomePage() {

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTest, setIsLoadingTest] = useState(true);

    const { data } = useAppQuery({
        url: "/api/getShopInfo",
        reactQueryOptions: {
            onSuccess: (data) => {
                setIsLoading(false);
            },
        },
    });

    const { test } = useAppQuery({
      url: "/api/getTest",
      reactQueryOptions: {
          onSuccess: (test) => {
              setIsLoadingTest(false);
          },
      },
  });

  return (
    <Page narrowWidth>
      <TitleBar title="Opentrust" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <Stack.Item fill>
                <TextContainer spacing="loose">
                  <Stack>
                    <Heading>Status</Heading>
                    <Badge status={isLoading ? "attention" : ((data.name != "" && data.email != "") ? "success" : "critical" )}>
                      {isLoading ? "Loading" : ((data.name != "" && data.email != "") ? "Active" : "Inactive" )}
                    </Badge>
                  </Stack>
                  <p>
                    You can now display your reviews using our app block.
                  </p>
                  <Subheading>shop name</Subheading>
                  <TextContainer spacing="loose">
                    <p>{isLoading ? "-" : data.name}</p>
                  </TextContainer>
                  <Subheading>shop email</Subheading>
                  <TextContainer spacing="loose">
                    <p>{isLoading ? "-" : data.email}</p>
                  </TextContainer>
                  <Subheading>webhook status</Subheading>
                  <TextContainer spacing="loose">
                    <p>{isLoadingTest ? "-" : test}</p>
                  </TextContainer>

                </TextContainer>
              </Stack.Item>

            </Stack>
          </Card>
        </Layout.Section>
        {/* <Layout.Section>
          <ProductsCard />
        </Layout.Section> */}
      </Layout>
    </Page>
  );
}

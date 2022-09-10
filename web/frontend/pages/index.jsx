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
  MediaCard,
  Form,
  FormLayout,
  TextField,
  Button,
  Toast,
  Frame
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

import { trophyImage, opentrustIcon, imageSetup } from "../assets";

import { ProductsCard, HelloCard } from "../components";
import { OrdersManagement } from "../../orders_management.js";
import {} from 'dotenv/config';

export default function HomePage() {

    OrdersManagement.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
    const [shop, setShop] = useState('');
    const [name, setName] = useState('loading...');
    const [email, setEmail] = useState('loading...');
    const [url, setUrl] = useState('loading...');
    const [activeToast, setActiveToast] = useState(false);

    // const handleSubmit = useCallback((_event) => { toggleActiveToast(); console.log(name);console.log(email);console.log(url); }, []);
    const handleSubmit = useCallback(async () => { OrdersManagement.update(shop) });

    const handleChangeName = useCallback((newValue) => setName(newValue), []);
    const handleChangeEmail = useCallback((newValue) => setEmail(newValue), []);
    const handleChangeUrl = useCallback((newValue) => setUrl(newValue), []);
    const toggleActiveToast = useCallback(() => setActiveToast((activeToast) => !activeToast), []);

    const toastMarkup = activeToast ? (
        <Toast content="Saved!" onDismiss={setActiveToast} />
    ) : null;

    const [isLoading, setIsLoading] = useState(true);
    const [topics, setTopics] = useState("-");

    const { data } = useAppQuery({
        url: "/api/getShopInfo",
        reactQueryOptions: {
            onSuccess: (data) => {
                setShop(data.shop);
                setName(data.shown_name ?? data.name);
                setEmail(data.shown_email ?? data.email);
                setUrl(data.shown_url ?? data.shop);
                console.log(JSON.stringify(data));
                setIsLoading(false);
            },
        },
    });

    useAppQuery({
      url: "/api/getTest",
      reactQueryOptions: {
          onSuccess: (data) => {
              console.log(data.topics);
              setTopics(data.topics);
          },
      },
  });

  return (
    <Frame>
        <Page narrowWidth>
        <TitleBar title="Opentrust" primaryAction={null} />
        <Layout>
            <Layout.Section>
            <MediaCard
                title="Getting Started"
                description="The extension app block is now available, you can add it to your shop Customizing your theme clicking on Add section."
                popoverActions={[{content: 'Dismiss', onAction: () => {}}]}
            >
                <Image
                    width="100%"
                    height="100%"
                    style={{objectFit: 'cover', objectPosition: 'center'}}
                    source={imageSetup}
                    alt="Add the block to the theme to display the reviews"
                />
            </MediaCard>

            <Card title="Opentrust dashboard">
                <Card.Section title="Status">
                    <p>{isLoading ? "Loading" : ((data.name != "" && data.email != "") ? "Active" : "Inactive" )}</p>
                </Card.Section>
                <Card.Section title="Webhooks">
                    {topics.split('\n').filter(n => n).map(str => <p>{str}&nbsp;</p>)}
                </Card.Section>
                <Card.Section title="Info">
                    <Form noValidate onSubmit={handleSubmit}>
                        <FormLayout>
                            <TextField
                                value={name}
                                label="Shop name"
                                onChange={handleChangeName}
                                autoComplete="off"
                            />
                            <TextField
                                label="Shop email"
                                type="email"
                                value={email}
                                onChange={handleChangeEmail}
                                autoComplete="email"
                            />
                            <TextField
                                value={url}
                                label="Shop URL"
                                type="url"
                                onChange={handleChangeUrl}
                                autoComplete="off"
                            />

                            <Button submit>Save</Button>
                        </FormLayout>
                    </Form>
                </Card.Section>
            </Card>

            </Layout.Section>
        </Layout>
        {toastMarkup}
        </Page>
    </Frame>
  );
}

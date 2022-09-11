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

// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

export default function HomePage() {

    const [shop, setShop] = useState('');
    const [dismissed, setDismissed] = useState(true);
    const [name, setName] = useState('loading...');
    const [email, setEmail] = useState('loading...');
    const [url, setUrl] = useState('loading...');
    const [activeToast, setActiveToast] = useState(false);

    // const handleSubmit = useCallback((_event) => { toggleActiveToast(); console.log(name);console.log(email);console.log(url); }, []);
    const handleSubmit = useCallback(async () => { 
        /*const result =*/ await postData("https://updateshop.deno.dev", {
            shop: shop,
            name: name,
            email: email,
            url: url
        });
        toggleActiveToast();
    });

    const handleChangeName = useCallback((newValue) => setName(newValue), []);
    const handleChangeEmail = useCallback((newValue) => setEmail(newValue), []);
    const handleChangeUrl = useCallback((newValue) => setUrl(newValue), []);
    const toggleActiveToast = useCallback(() => setActiveToast((activeToast) => !activeToast), []);

    const toastMarkup = activeToast ? (
        <Toast content="Saved" onDismiss={setActiveToast} />
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
                setUrl(data.shown_shop ?? data.shop);
                setDismissed(data.dismissed ?? true);
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

                {
                    !dismissed && (
                        <MediaCard
                            title="Getting Started"
                            description="The extension app block is now available, you can add it to your shop Customizing your theme clicking on Add section."
                            popoverActions={[{content: 'Dismiss', onAction: async () => {
                                /*const result =*/ await postData("https://updateshop.deno.dev", {
                                    shop: shop,
                                    dismissed: true
                                });
                                setDismissed(true);
                            }}]}
                        >
                            <Image
                                width="100%"
                                height="100%"
                                style={{objectFit: 'cover', objectPosition: 'center'}}
                                source={imageSetup}
                                alt="Add the block to the theme to display the reviews"
                            />
                        </MediaCard>
                    )
                }

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

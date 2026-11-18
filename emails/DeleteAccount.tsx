import { emailUserData } from '@/lib/types/BetterAuthSessionType';
import React from 'react';
import { Html, Head, Body, Container, Font, Section, Row, Column, Heading, Text, Button, Link, Hr } from 'react-email';

export default function DeleteAccount({ user, url }: { user: emailUserData, url: string }) {
    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Geist"
                    fallbackFontFamily="Arial"
                    webFont={{
                        url: "https://fonts.googleapis.com/css2?family=Geist:ital,wght@0,100..900;1,100..900&display=swap",
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
                <Font
                    fontFamily="Arial Black"
                    fallbackFontFamily="Arial"
                    webFont={{
                        url: "https://fonts.googleapis.com/css2?family=Arial+Black:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Body style={bodyStyle}>
                <Container style={containerStyle}>
                    <Section style={style1}>
                        <Row style={style2}>
                            <Column style={{ verticalAlign: 'top', width: '56%' }}>
                                <Text style={style3}>WARDPASS.</Text>
                            </Column>
                            <Column style={{ verticalAlign: 'top', width: '44%' }}>
                                <Text style={style4}>Account</Text>
                            </Column>
                        </Row>
                    </Section>
                    <Section style={style5}>
                        <Text style={style6}>Account Deletion Requested</Text>
                        <Heading as="h1" style={style7}>WE’RE SORRY TO<br />SEE YOU GO.</Heading>
                        <Text style={style8}>We wish to see you back soon! Nevertheless, click the button below to confirm your account deletion request for {user.email}</Text>
                    </Section>
                    <Section style={style9}>
                        <Section style={{ height: '24px' }} />
                        <Row style={style10}>
                            <Column style={{ verticalAlign: 'top', width: '70%' }}>
                                <Text style={style11}>Data retained until</Text>
                            </Column>
                            <Column style={{ verticalAlign: 'top', width: '30%' }}>
                                <Text style={style12}>Confirmation is complete</Text>
                            </Column>
                        </Row>
                        <Hr style={style13} />
                        <Text style={style14}>Grab your data before you delete your account — Export credentials from all your vaults before confirming this request.</Text>
                        <Button href={url} style={style15}>DELETE ACCOUNT</Button>
                        <Text style={style16}>Changed your mind before comfirming this request? Resume instantly and nothing is lost. The request will automatically expire in 30 days.</Text>
                    </Section>
                    <Section style={style17}>
                        <Text style={style18}>WARDPASS.</Text>
                        <Text style={style19}>Secure credential management.<br />Designed and developed by WardPass team. Contact support for more information.</Text>
                        <Section style={{ height: '16px' }} />
                        <Row style={style2}>
                            <Column style={{ verticalAlign: 'top', width: '38%' }}>
                                <Link href="#" style={style20}>Email preferences</Link>
                            </Column>
                            <Column style={{ verticalAlign: 'top', width: '30%' }}>
                                <Link href="#" style={style20}>Unsubscribe</Link>
                            </Column>
                            <Column style={{ verticalAlign: 'top', width: '32%' }}>
                                <Link href="#" style={style20}>Privacy</Link>
                            </Column>
                        </Row>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const bodyStyle: React.CSSProperties = {
    backgroundColor: '#FAF9F6',
    fontFamily: '"Geist", Arial, sans-serif',
};

const containerStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#FBFAF7',
};

const style1: React.CSSProperties = {
    backgroundColor: "#0B0B14",
    padding: "22px 32px",
};

const style2: React.CSSProperties = {
    padding: "0px",
};

const style3: React.CSSProperties = {
    margin: "0px",
    fontFamily: "'Arial Black', 'Arial Bold', Arial, Helvetica, sans-serif",
    fontSize: "24px",
    lineHeight: "26px",
    letterSpacing: "-0.03em",
    color: "#FBFAF7",
};

const style4: React.CSSProperties = {
    margin: "0px",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    lineHeight: "26px",
    color: "#7C9299",
    textAlign: "right",
};

const style5: React.CSSProperties = {
    backgroundColor: "#F2EEE2",
    padding: "48px 32px 42px 32px",
};

const style6: React.CSSProperties = {
    margin: "0 0 14px 0",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.20em",
    textTransform: "uppercase",
    lineHeight: "16px",
    color: "#0B0B14",
};

const style7: React.CSSProperties = {
    margin: "0px",
    fontFamily: "'Arial Black', 'Arial Bold', Arial, Helvetica, sans-serif",
    fontWeight: "400",
    fontSize: "56px",
    lineHeight: "57px",
    letterSpacing: "-0.025em",
    color: "#0B0B14",
};

const style8: React.CSSProperties = {
    margin: "18px 0 0 0",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "17px",
    lineHeight: "26px",
    color: "#0B0B14",
};

const style9: React.CSSProperties = {
    backgroundColor: "#FBFAF7",
    padding: "36px 32px",
};

const style10: React.CSSProperties = {
    padding: "14px 0",
};

const style11: React.CSSProperties = {
    margin: "0px",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "15px",
    lineHeight: "22px",
    color: "#0B0B14",
};

const style12: React.CSSProperties = {
    margin: "0px",
    fontFamily: "'Arial Black', 'Arial Bold', Arial, Helvetica, sans-serif",
    fontSize: "15px",
    lineHeight: "22px",
    color: "#0B0B14",
    textAlign: "right",
};

const style13: React.CSSProperties = {
    borderColor: "#F4F2ED",
    borderTopWidth: "1px",
    margin: "0px",
};

const style14: React.CSSProperties = {
    margin: "18px 0 0 0",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "16px",
    lineHeight: "25px",
    color: "#0B0B14",
};

const style15: React.CSSProperties = {
    backgroundColor: "#0B0B14",
    color: "#D6A51D",
    borderRadius: "2px",
    padding: "18px 34px",
    fontFamily: "'Arial Black', 'Arial Bold', Arial, Helvetica, sans-serif",
    fontSize: "15px",
    fontWeight: "400",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    textDecoration: "none",
    display: "inline-block",
    margin: "28px 0 0 0",
};

const style16: React.CSSProperties = {
    margin: "14px 0 0 0",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "13px",
    lineHeight: "20px",
    color: "#7C9299",
};

const style17: React.CSSProperties = {
    backgroundColor: "#0B0B14",
    padding: "34px 32px 40px 32px",
};

const style18: React.CSSProperties = {
    margin: "0px",
    fontFamily: "'Arial Black', 'Arial Bold', Arial, Helvetica, sans-serif",
    fontSize: "20px",
    lineHeight: "22px",
    letterSpacing: "-0.02em",
    color: "#FBFAF7",
};

const style19: React.CSSProperties = {
    margin: "14px 0 0 0",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "12px",
    lineHeight: "19px",
    color: "#7C9299",
};

const style20: React.CSSProperties = {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "12px",
    lineHeight: "19px",
    color: "#7C9299",
    textDecoration: "underline",
    display: "block",
};

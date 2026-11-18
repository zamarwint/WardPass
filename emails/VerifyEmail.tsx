import { emailUserData } from '@/lib/types/BetterAuthSessionType';
import React from 'react';
import { Html, Head, Body, Container, Font, Section, Row, Column, Heading, Text, Button, Link } from 'react-email';

export default function VerifyEmail({ user, url }: { user: emailUserData, url: string }) {
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
                                <Text style={style4}>Security</Text>
                            </Column>
                        </Row>
                    </Section>
                    <Section style={style5}>
                        <Text style={style6}>Verify your address</Text>
                        <Heading as="h1" style={style7}>CONFIRM<br />THIS EMAIL.</Heading>
                        <Text style={style8}>Tap the button below to confirm {user.email}. The link expires in 24 hours.</Text>
                        <Button href={url} style={style9}>Verify email address</Button>
                    </Section>
                    <Section style={style13}>
                        <Text style={style14}>WARDPASS.</Text>
                        <Text style={style15}>Secure credential management.<br />Designed and developed by WardPass team. Contact support for more information.</Text>
                        <Section style={{ height: '16px' }} />
                        <Row style={style2}>
                            <Column style={{ verticalAlign: 'top', width: '38%' }}>
                                <Link href="#" style={style16}>Email preferences</Link>
                            </Column>
                            <Column style={{ verticalAlign: 'top', width: '30%' }}>
                                <Link href="#" style={style16}>Unsubscribe</Link>
                            </Column>
                            <Column style={{ verticalAlign: 'top', width: '32%' }}>
                                <Link href="#" style={style17}>Privacy</Link>
                            </Column>
                        </Row>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const bodyStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
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
    color: "#D6A51D",
    textAlign: "right",
};

const style5: React.CSSProperties = {
    backgroundColor: "#F2EEE2",
    padding: "52px 32px",
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
    fontSize: "50px",
    lineHeight: "51px",
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
    backgroundColor: "#D6A51D",
    color: "#0B0B14",
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

const style13: React.CSSProperties = {
    backgroundColor: "#0B0B14",
    padding: "34px 32px 40px 32px",
};

const style14: React.CSSProperties = {
    margin: "0px",
    fontFamily: "'Arial Black', 'Arial Bold', Arial, Helvetica, sans-serif",
    fontSize: "20px",
    lineHeight: "22px",
    letterSpacing: "-0.02em",
    color: "#FBFAF7",
};

const style15: React.CSSProperties = {
    margin: "14px 0 0 0",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "12px",
    lineHeight: "19px",
    color: "#7C9299",
};

const style16: React.CSSProperties = {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "12px",
    lineHeight: "19px",
    color: "#D6A51D",
    textDecoration: "underline",
    display: "block",
};

const style17: React.CSSProperties = {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "12px",
    lineHeight: "19px",
    color: "#7C9299",
    textDecoration: "underline",
    display: "block",
};

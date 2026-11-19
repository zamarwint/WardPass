import React from 'react';
import { Html, Head, Body, Container, Font, Section, Row, Column, Heading, Text, Link } from 'react-email';

export default function ChangeEmailOTP({ email, otp }: { email: string, otp: string }) {
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
                                <Text style={style4}>SECURITY</Text>
                            </Column>
                        </Row>
                    </Section>
                    <Section style={style5}>
                        <Text style={style6}>EMAIL CHANGE REQUEST</Text>
                        <Heading as="h1" style={style7}>CONFIRM<br />THIS<br />EMAIL CHANGE.</Heading>
                        {/* {email} */}
                        <Text style={style8}>Someone requested to change your email address to {email}. If that was you, set a new one now. The code works for 60 minutes.</Text>
                    </Section>
                    <Section style={style9}>
                        <Row>
                            {/* OTP */}
                            <Column style={{ verticalAlign: 'top' }}>
                                <Text>{otp}</Text>
                            </Column>
                        </Row>
                        <Text style={style14}>If you didn’t request an email change for your WardPass account, ignore this email — nothing happens without confirmation.</Text>
                    </Section>
                    <Section style={style15}>
                        <Text style={style16}>WARDPASS.</Text>
                        <Text style={style17}>Secure credential management.<br />Designed and developed by WardPass team. Contact support for more information.</Text>
                        <Section style={{ height: '16px' }} />
                        <Row style={style2}>
                            <Column style={{ verticalAlign: 'top', width: '38%' }}>
                                <Link href="#" style={style18}>Email preferences</Link>
                            </Column>
                            <Column style={{ verticalAlign: 'top', width: '30%' }}>
                                <Link href="#" style={style18}>Unsubscribe</Link>
                            </Column>
                            <Column style={{ verticalAlign: 'top', width: '32%' }}>
                                <Link href="#" style={style19}>Privacy</Link>
                            </Column>
                        </Row>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const bodyStyle: React.CSSProperties = {
    backgroundColor: '#F4F2ED',
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
    backgroundColor: "#0B0B14",
    padding: "52px 32px 46px 32px",
};

const style6: React.CSSProperties = {
    margin: "0 0 14px 0",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.20em",
    textTransform: "uppercase",
    lineHeight: "16px",
    color: "#D6A51D",
};

const style7: React.CSSProperties = {
    margin: "0px",
    fontFamily: "'Arial Black', 'Arial Bold', Arial, Helvetica, sans-serif",
    fontWeight: "400",
    fontSize: "50px",
    lineHeight: "51px",
    letterSpacing: "-0.025em",
    color: "#FBFAF7",
};

const style8: React.CSSProperties = {
    margin: "18px 0 0 0",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "17px",
    lineHeight: "26px",
    color: "#7C9299",
};

const style9: React.CSSProperties = {
    backgroundColor: "#FBFAF7",
    padding: "38px 32px",
};

const style13: React.CSSProperties = {
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

const style14: React.CSSProperties = {
    margin: "14px 0 0 0",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "13px",
    lineHeight: "20px",
    color: "#7C9299",
};

const style15: React.CSSProperties = {
    backgroundColor: "#0B0B14",
    padding: "34px 32px 40px 32px",
};

const style16: React.CSSProperties = {
    margin: "0px",
    fontFamily: "'Arial Black', 'Arial Bold', Arial, Helvetica, sans-serif",
    fontSize: "20px",
    lineHeight: "22px",
    letterSpacing: "-0.02em",
    color: "#FBFAF7",
};

const style17: React.CSSProperties = {
    margin: "14px 0 0 0",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "12px",
    lineHeight: "19px",
    color: "#7C9299",
};

const style18: React.CSSProperties = {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "12px",
    lineHeight: "19px",
    color: "#D6A51D",
    textDecoration: "underline",
    display: "block",
};

const style19: React.CSSProperties = {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "12px",
    lineHeight: "19px",
    color: "#7C9299",
    textDecoration: "underline",
    display: "block",
};

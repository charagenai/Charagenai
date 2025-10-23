export const metadata = {
 title: 'CharaGenAI',
 description: 'AI-powered character generator',
};
export default function RootLayout({ children }) {
 return (
<html lang="en">
<body style={{ margin: 0, padding: 0 }}>{children}</body>
</html>
 );
}

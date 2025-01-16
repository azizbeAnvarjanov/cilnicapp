import publicIp from "public-ip";

export async function getServerSideProps() {
  const userIp = await publicIp.v4();
  return {
    props: { userIp }, // IP-ni frontendga yuboring
  };
}

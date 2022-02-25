export function load(ctx) {

  const gx=`
<conduit-content-page name="home_page">
  <conduit-home-page>
    <script src="../conduit/js/showdown/showdown.min.js" await="true" />
  </conduit-home-page>
</conduit-content-page>
  `;

  return {gx};
};
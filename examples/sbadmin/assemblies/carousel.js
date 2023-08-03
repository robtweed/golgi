export function load() {
  let gx=`
<sbadmin-content-page name="carousel">
  <sbadmin-content-heading text="Carousel" position="center"/>

    <sbadmin-carousel operation="auto" interval="4">

      <sbadmin-carousel-item active="true">
        <sbadmin-card width="50%" position="center" bgColor="warning" textColor="white">
          <sbadmin-card-header text="Warning Card" />
          <sbadmin-card-body text="Card body text" />
          <sbadmin-card-footer text="Footer text" />
        </sbadmin-card>
      </sbadmin-carousel-item>

      <sbadmin-carousel-item>
        <sbadmin-card width="50%" position="center" bgColor="danger" textColor="dark">
          <sbadmin-card-header text="Danger Card" />
          <sbadmin-card-body text="Second Card body text" />
          <sbadmin-card-footer text="2nd Footer text" />
        </sbadmin-card>
      </sbadmin-carousel-item>

      <sbadmin-carousel-item>
        <sbadmin-card width="50%" position="center" bgColor="success" textColor="dark">
          <sbadmin-card-header text="Success Card" />
          <sbadmin-card-body text="Third Card body text" />
          <sbadmin-card-footer text="3rd Footer text" />
        </sbadmin-card>
      </sbadmin-carousel-item>

    </sbadmin-carousel>


</sbadmin-content-page>
  `;


  return {gx};
};
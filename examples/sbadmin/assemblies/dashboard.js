export function load() {
  let gx=`
<sbadmin-content-page name="dashboard" golgi-hook="configure">
  <sbadmin-content-heading text="Dashboard" />
  <sbadmin-row>
    <sbadmin-card layoutClass="col-xl-3 col-md-6 noheader" bgColor="warning" textColor="white" title="Warning Card">
      <sbadmin-div golgi-appendTo="bodyTag" text="Card body text" />
      <sbadmin-div golgi-appendTo="footerTag" text="Footer text" />
    </sbadmin-card>
    <sbadmin-card layoutClass="col-xl-3 col-md-6 noheader" bgColor="danger" title="Danger Card" textColor="dark">
      <sbadmin-div golgi-appendTo="bodyTag" text="Card body text" />
      <sbadmin-div golgi-appendTo="footerTag" text="Footer text" />
    </sbadmin-card>
  </sbadmin-row>

  <sbadmin-row>
    <sbadmin-card layoutClass="col-xl-6 nofooter">
      <sbadmin-card-title iconClass="chart-area" title="Area Chart Example" golgi-appendTo="headerTag"/>
      <chart-root golgi-appendTo="bodyTag">
        <chart-area-plot golgi-hook="draw" golgi-stateMap="chart:update"/>
      </chart-root>
    </sbadmin-card>
  </sbadmin-row>

</sbadmin-content-page>
  `;

  let hooks = {
    'sbadmin-content-page': {
      configure: function() {
        console.log('**** configuring sbadmin-content-page ' + this.name);
        console.log(this.context);
        let _this = this;
        this.onSelected = function() {
          console.log('Page ' + _this.name + ' selected');
        }
      }
    },
    'chart-area-plot': {
      draw: function() {
        let config = {
          type: 'line',
          data: {
            labels: ["Mar 1", "Mar 2", "Mar 3", "Mar 4", "Mar 5", "Mar 6", "Mar 7", "Mar 8", "Mar 9", "Mar 10", "Mar 11", "Mar 12", "Mar 13"],
            datasets: [{
              label: "Sessions",
              lineTension: 0.3,
              backgroundColor: "rgba(2,117,216,0.2)",
              borderColor: "rgba(2,117,216,1)",
              pointRadius: 5,
              pointBackgroundColor: "rgba(2,117,216,1)",
              pointBorderColor: "rgba(255,255,255,0.8)",
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(2,117,216,1)",
              pointHitRadius: 50,
              pointBorderWidth: 2,
              data: [10000, 30162, 26263, 18394, 18287, 28682, 31274, 33259, 25849, 24159, 32651, 31984, 38451],
            }],
          },
          options: {
            scales: {
              xAxes: [{
                time: {
                  unit: 'date'
                },
                gridLines: {
                  display: false
                },
                ticks: {
                  maxTicksLimit: 7
                }
              }],
              yAxes: [{
                ticks: {
                  min: 0,
                  max: 40000,
                  maxTicksLimit: 5
                },
                gridLines: {
                  color: "rgba(0, 0, 0, .125)",
                }
              }],
            },
            legend: {
              display: false
            }
          }
        };

        this.draw(config);
      }
    }
  }
  return {gx, hooks};
};
const gameArea =  {
    "type": "Polygon",
          "coordinates": [
            [
              [
                12.540721893310547,
                55.716958568084955
              ],
              [
                12.51668930053711,
                55.706610973973476
              ],
              [
                12.520122528076172,
                55.68619787312307
              ],
              [
                12.551193237304688,
                55.67748761984024
              ],
              [
                12.570762634277344,
                55.697615044249304
              ],
              [
                12.566471099853516,
                55.715604833104024
              ],
              [
                12.540721893310547,
                55.716958568084955
              ]
            ]
          ]
}

const players= [
  {
    "type": "Feature",
    "properties": {"name":"Peter"},
    "geometry": {
      "type": "Point",
      "coordinates": [

            12.545700073242186,
            55.71985927077616
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {"name":"Ole"},
        "geometry": {
          "type": "Point",
          "coordinates": [
            12.532825469970703,
            55.7058372119569
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {"name":"Lars"},
        "geometry": {
          "type": "Point",
          "coordinates": [
            12.511539459228516,
            55.71009271344361
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {"name":"Bo"},
        "geometry": {
          "type": "Point",
          "coordinates": [
            12.55462646484375,
            55.70612737450863
          ]
        }
      }
    ]
module.exports = { gameArea,players }
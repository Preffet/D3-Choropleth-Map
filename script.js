// provided data sources
let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

let countyInfo
let educationInfo

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {
    canvas.selectAll('path')
            .data(countyInfo)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', (countyInfoItem) => {
                let id = countyInfoItem['id']
                let county = educationInfo.find((item) => {
                    return item['fips'] === id
                })
                let percentage = county['bachelorsOrHigher']
                if(percentage <= 15){
                    return '#4B778D'
                }else if(percentage <= 30){
                    return '#28B5B5'
                }else if(percentage <= 45){
                    return '#8fd9c0'
                }else{
                    return '#d6ff66'
                }
            })
            .attr('data-education', (countyInfoItem) => {
                let id = countyInfoItem['id']
                let county = educationInfo.find((item) => {
                    return item['fips'] === id
                })
                let percentage = county['bachelorsOrHigher']
                return percentage
            })
            .attr('data-fips', (countyInfoItem) => {
                return countyInfoItem['id']
            })
            .on('mouseover', (countyInfoItem)=> {
                tooltip.transition()
                    .style('visibility', 'visible')
                let id = countyInfoItem['id']
                let county = educationInfo.find((item) => {
                    return item['fips'] === id})
                // add tooltip text
                tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + 
                    county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')

                tooltip.attr('data-education', county['bachelorsOrHigher'] )
            })
            .on('mouseout', (countyInfoItem) => {
                tooltip.transition()
                    .style('visibility', 'hidden')})}

d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log(log)
        }else{
            countyInfo = topojson.feature(data, data.objects.counties).features
            d3.json(educationURL).then(
                (data, error) => {
                    if(error){
                        // log the errors
                        console.log(error)
                    }else{
                        educationInfo = data
                        drawMap()
                    }})}})

import React from 'react';

import ReactPlayer from 'react-player'

//import './bootstrap_landing_page_template/css/styles.css'

import "./components/bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "./components/bootstrap_gene_page/css/sb-admin-2.min.css"

import './components/HomePage.css'

function debounce(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  };
}

function About() {

  // orig window dimensions: 1536 x 754 (width x height)
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  })

  // initially width too small so modify for that in initial case
  const [vid_width, setVidWidth] = React.useState(
    Math.ceil((Math.ceil((window.innerHeight * 16) / 9)) * ((window.innerWidth / (Math.ceil((window.innerHeight * 16) / 9))) + 0.2))
  )
  const [vid_height, setVidHeight] = React.useState(
    Math.ceil(window.innerHeight * ((window.innerWidth / (Math.ceil((window.innerHeight * 16) / 9))) + 0.2))
  )

  React.useEffect(() => {
    const debouncedHandleResize = debounce(async function handleResize() {

      // aspect ratio: 16 : 9 (width to heigth)
      let new_width = 0;
      let new_height = 0;

      if ((window.innerWidth / window.innerHeight) > (16 / 9)) {
        // height matches but the width does not match
        // width of video smaller
        new_height = window.innerHeight
        new_width = Math.ceil((new_height * 16) / 9)

        // but need to scale up to match window
        // cusion up for safety
        let scale = window.innerWidth / new_width
        scale = scale + 0.2

        new_height = Math.ceil(new_height * scale)
        new_width = Math.ceil(new_width * scale)

      } else {
        // width matches but height of video smaller
        new_width = window.innerWidth
        new_height = Math.floor((new_width * 9) / 16)

        // but need to scale up to match window
        // cusion up for safety
        let scale = window.innerHeight / new_height
        scale = scale + 0.2

        new_height = Math.ceil(new_height * scale)
        new_width = Math.ceil(new_width * scale)
      }

      console.log("aspect ratio cur: ")
      console.log((window.innerWidth / window.innerHeight))
      console.log("new height: ", new_height, "  new width: ", new_width)
      console.log("window height: ", window.innerHeight, "   window width: ", window.innerWidth)


      await setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });

      await setVidWidth(new_width)
      await setVidHeight(new_height)


    }, 1000)

    window.addEventListener('resize', debouncedHandleResize)

    return _ => {
      window.removeEventListener('resize', debouncedHandleResize)

    }
  })
  return (
    <body class="home_page_body">

      <nav id="landing_page_navbar" class="navbar navbar-expand bg-transparent shadow">


      <ul class="navbar-nav">
          <li class="nav-item active">
            <a class="nav-link" href="/"> <div id="landing_page_nav_text">Home</div> <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/about"> <div id="landing_page_nav_text">About</div> </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/contact"> <div id="landing_page_nav_text">Contact Us</div> </a>
          </li>
        </ul>


      </nav>


      <ReactPlayer
        id="video_back"
        url='https://static.videezy.com/system/resources/previews/000/018/787/original/Komp_2.mp4'
        loop={true}
        playing={true}
        volume={0}
        muted={true}
        controls={false}
        //style={{ minWidth:parseInt(dimensions.width), minHeight:parseInt(dimensions.height),  width: parseInt(dimensions.width), height: parseInt(dimensions.height), position: 'absolute', left: 0, right: 0 }}
        style={{ minWidth: vid_width, minHeight: vid_height, width: vid_width, height: vid_height, position: 'absolute', left: 0, right: 0, zindex: -1 }}
        onLoad={async (response) => {
          const { width, height } = response.naturalSize;
          //
        }}
        disablePictureInPicture={true}
      />

      <div id="title_landing_info">
        <div class="h1 text-white d-flex align-items-center justify-content-center" id="title_website">About</div>
        <div class="h4 text-white mx-5 d-flex align-items-center justify-content-center blockquote text-center">
          The Sharp lab at UC Davis Medical Center studies gene expression in patients with neurological and developmental disorders.
          We investigate the pathophysiology of such disorders and identify gene expression changes that can lead to the development of diagnostic biomarkers and therapeutics.
          Our team has accumulated a vast amount of data. In the current way we access our projects, it may take days and several people to gather manually information regarding patient cohorts, clinical characteristics, patient history, sample types and results, as they are archived in separate sources and data types.
          Having this information integrated in a single queriable platform, will facilitate our research, manuscript and grant writing, and preparation of data to share with stakeholders.
        </div>
      </div>

      <script src="./bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
      <script src="./bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="./bootstrap_gene_page/js/sb-admin-2.min.js"></script>
      <script src="./bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>

      <script src="./bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>

      <script src="./bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
      <script src="./bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>

    </body>
  )

}

export default About
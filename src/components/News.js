import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Loader from './Loader';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';



export class News extends Component {

  static defaultProps = 
  {
    country:'in',
    pageSize: 8,
    category: 'general',
  }
  

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }
    capitalizeFirstLetter = (string)=> 
    {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    constructor(props)
    {
      super(props);
        console.log("Hello I am a constructor from News component");
        this.state ={
            articles : [],
            loading: true,
            page : 1,
            totalResults:0
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
    }

    async updateNews(){
      this.props.setProgress(10);
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      this.setState({loading : true})
      let data = await fetch(url);
      this.props.setProgress(30);
      let parsedData = await data.json()
      this.props.setProgress(70);
      console.log(parsedData)
      this.setState({articles: parsedData.articles,
         totalResults:parsedData.totalResults,
        loading : false})
      
      this.props.setProgress(100);
    }

    async componentDidMount() // This will run after render
    {
     //console.log("cdm")
     //let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e60cbce786d1432382aac6be6aa56b6d&page=1&pageSize=${this.props.pageSize}`;
     //this.setState({loading : true})
     //let data = await fetch(url);
     //let parsedData = await data.json()
     //console.log(parsedData)
     //this.setState({articles: parsedData.articles,
     //   totalResults:parsedData.totalResults,
     //  loading : false })
     this.updateNews();
    }

    handlePreviousClick = async () =>
    {
     // console.log("Previous");
     // console.log("Next");
     // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e60cbce786d1432382aac6be6aa56b6d&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;//backticks +_ $ I used
     // this.setState({loading : true})
     // let data = await fetch(url);
     // let parsedData = await data.json()
     // console.log(parsedData)
     // this.setState({
     //   page: this.state.page -1,
     //   articles: parsedData.articles,
     //   loading : false
     // })
     this.setState({page: this.state.page-1})
     this.updateNews();
      
    }

   handleNextClick = async () =>
    {
    // console.log("Next");
    // if(!(this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)))
    // {

    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e60cbce786d1432382aac6be6aa56b6d&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;//backticks +_ $ I used
    // this.setState({loading : true})
    // let data = await fetch(url);
    // let parsedData = await data.json()
    // this.setState({loading : false})
    // this.setState({
    //   page: this.state.page +1,
    //   articles: parsedData.articles,
    //   loading : false
    // })
    // }
    this.setState({page : this.state.page+1})
    this.updateNews();
      
    }

    fetchMoreData = async () => {
      this.setState({page:this.state.page + 1})
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      
      let data = await fetch(url);
      let parsedData = await data.json()
      console.log(parsedData)
      this.setState({articles: this.state.articles.concat(parsedData.articles),
         totalResults:parsedData.totalResults,
        loading : false})
      
    };

  render() {
    return (
      <>

      {console.log("hi")}
        <h1 className="text-center" style={{margin: '35px 0px'}}>NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
       { /* ********BELOW Line in js was like when this.state.loading == 0 show me the Loader component so when wherever you use this this.state.loading if it is true then it loads loader(spinnger) html component*/}
        {this.state.loading && <Loader/>} 
        <InfiniteScroll
            
            dataLength = {this.state.articles.length}
            next = {this.fetchMoreData}
            hasMore={this.state.articles.length !== this.state.totalResults}
            loader={<Loader/>}
        >
          <div className="container">
          <div  className='container'>
        <div className = "row">
        { this.state.articles.map((element)=>{
         return <div className="col-md-4" key ={element.url}>
          <NewsItem  title = {element.title?element.title.slice(0,45) : ""} description = {element.description?element.description.slice(0,88):""} imageUrl = {element.urlToImage}
          newsUrl = {element.url} author = {element.author} date={element.publishedAt} source={element.source.name}/> 
          </div>
        })}
        </div>
        </div>
        </div>
        </InfiniteScroll>

        {/*<div className="container d-flex justify-content-between">
          <button disabled ={this.state.page<=1} type="button" class = "btn btn-dark" onClick={this.handlePreviousClick}> &larr; Previous</button>
          <button disabled = {this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize)}type="button" className = "btn btn-dark" onClick={this.handleNextClick}>Next &rarr; </button>
      </div>*/}
      </>
    )
  }
}

export default News

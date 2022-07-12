import { Component, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { APP_EVENTS, listItemPerPage } from '../../../constants';
import { ExtraInfo, MentorBaseResponseDto, MentorDetailResponseDto } from '../../../definition';
import { appEventEmitter } from '../../../initialization';
import { asyncDeleteMentor, asyncGetMentorDetail, asyncGetMentors, asyncSaveMentor } from '../../../services/mentor.services';
import { ItemDetailComponent, ListComponent, OverlayComponent } from '../../components';

export class MentorsPage extends Component<
  any,
  { mentors: MentorBaseResponseDto[], currentPage : number, totalPage : number }
> {
  constructor(props: any) {
    super(props);
    
    const searchParams = new URLSearchParams(window.location.search);
    const pageString  =searchParams.get('page');
    const currentPage = pageString ? parseInt(pageString,0) : 0;

    this.state = {
      mentors: [],
      currentPage,
      totalPage: 0
    };
    appEventEmitter.emit(APP_EVENTS.app_loading, true);
  }
  componentDidMount() {
    this.getMentors();
  }

  getMentors(page:number = 0) {
    asyncGetMentors(page * listItemPerPage).then(({mentors,count}) => {
      const totalPage = Math.floor((count - 1)/listItemPerPage) +1;
      this.setState({mentors, totalPage, currentPage: page || 0});
      appEventEmitter.emit(APP_EVENTS.app_loading, false);
    }).catch(error=>{
      appEventEmitter.emit(APP_EVENTS.app_loading, false);
      toast.error(`Can not get mentors!${error.response?.data?.error?.message || error.message}`);
    })
  }

  onOpenDetail(id?: string){
    const onLoad = this.getMentors.bind(this, this.state.currentPage);
    appEventEmitter.emit(APP_EVENTS.app_display_mentor, {id, onLoad})
  }


  render() {
    const DisplayComponent = ListComponent<MentorBaseResponseDto>;
    return (
      <div className="mentors-page">
        <DisplayComponent
          title ='List of mentors'
          getId={(item) => item.mentorId} 
          items={this.state.mentors} 
          currentPage={this.state.currentPage || 0}
          totalPage={this.state.totalPage || 0}
          onOpenItem = {this.onOpenDetail.bind(this)}
          onLoadData={this.getMentors.bind(this)}
           />
          <MentorModal/>
      </div>
    );
  }
}


export class MentorModal extends Component<any,{
  displayOverlay?: boolean,
  mentor?:MentorDetailResponseDto
}> {

  removeEvent: (()=>void) | undefined;

  onLoad: (()=>void) | undefined;

  constructor(props:any) {
    super(props);
    this.state = {}
  }

  componentDidMount(){
    this.removeEvent = appEventEmitter.on(APP_EVENTS.app_display_mentor, ({id, onLoad}:{id: string, onLoad: ()=>void}) => {
      this.onLoad= onLoad;
      this.setState({displayOverlay: true, mentor: undefined});
      if (id) {
        appEventEmitter.emit(APP_EVENTS.app_loading, true);
        asyncGetMentorDetail(id).then(mentor => {
          appEventEmitter.emit(APP_EVENTS.app_loading, false);
          this.setState({ mentor});
        }).catch(error=>{
          toast.error(`Can not get mentor information!${error.response?.data?.error?.message || error.message}`);
        })
      }
    });
  }
  componentWillUnmount(){
    this.removeEvent && this.removeEvent();
  }


  async saveMentor (username: string,
    password: string,
    fullName: string,
    description: string,
    extra?: ExtraInfo[]) {
      try {
        appEventEmitter.emit(APP_EVENTS.app_loading, true);
      await asyncSaveMentor({
        mentorId: this.state.mentor?.mentorId,
        username, password, fullName,description,extra
      })
      this.onLoad && this.onLoad();
      appEventEmitter.emit(APP_EVENTS.app_loading, false);
      this.setState({displayOverlay: false});
      this.onLoad=undefined;
    }catch(error: any) {
      appEventEmitter.emit(APP_EVENTS.app_loading, false);
      toast.error(`Can not get mentors!${error.response?.data?.error?.message || error.message}`);
    }
  }

  async deleteMentor () {
    if (!this.state.mentor?.mentorId) {
      return;
    }
    try {
      appEventEmitter.emit(APP_EVENTS.app_loading, true);
      await asyncDeleteMentor(this.state.mentor.mentorId);
      this.onLoad && this.onLoad();
      appEventEmitter.emit(APP_EVENTS.app_loading, false);
      this.setState({displayOverlay: false});
      this.onLoad=undefined;
    }catch(error: any) {
      appEventEmitter.emit(APP_EVENTS.app_loading, false);
      toast.error(`Can not get mentors!${error.response?.data?.error?.message || error.message}`);
    }
  }

  render(): ReactNode {
    return <OverlayComponent display={!!this.state.displayOverlay}>
    {this.state.displayOverlay && <ItemDetailComponent<MentorDetailResponseDto>
      item= {this.state.mentor}
      onClose={()=>{ 
        this.setState({displayOverlay: false});
        this.onLoad=undefined;
      }}
      getId={(item)=> item.mentorId}
      onSave={this.saveMentor.bind(this)}
      onDelete={this.deleteMentor.bind(this)}
      title='Mentor'
     />}
  </OverlayComponent>;
  }

}


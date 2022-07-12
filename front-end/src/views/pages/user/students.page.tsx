import { Component, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { APP_EVENTS, listItemPerPage } from '../../../constants';
import { ExtraInfo, StudentBaseResponseDto, StudentDetailResponseDto } from '../../../definition';
import { appEventEmitter } from '../../../initialization';
import { asyncDeleteStudent, asyncGetStudentDetail, asyncGetStudents, asyncSaveStudent } from '../../../services';
import { ItemDetailComponent, ListComponent, OverlayComponent } from '../../components';

export class StudentsPage extends Component<
  any,
  { students: StudentBaseResponseDto[], currentPage : number, totalPage : number }
> {
  constructor(props: any) {
    super(props);
    
    const searchParams = new URLSearchParams(window.location.search);
    const pageString  =searchParams.get('page');
    const currentPage = pageString ? parseInt(pageString,0) : 0;

    this.state = {
      students: [],
      currentPage,
      totalPage: 0
    };
    appEventEmitter.emit(APP_EVENTS.app_loading, true);
  }
  componentDidMount() {
    this.getStudents();
  }

  getStudents(page: number = 0) {
    asyncGetStudents(page  * listItemPerPage).then(({students,count}) => {
      const totalPage = Math.floor((count || 0)/listItemPerPage) +1;
      this.setState({students, totalPage, currentPage: page || 0});
      appEventEmitter.emit(APP_EVENTS.app_loading, false);
    }).catch(error=>{
      appEventEmitter.emit(APP_EVENTS.app_loading, false);
      toast.error(`Can not get students!${error.response?.data?.error?.message || error.message}`);
    })
  }

  onOpenDetail(id?: string){
    const onLoad = this.getStudents.bind(this, this.state.currentPage);
    appEventEmitter.emit(APP_EVENTS.app_display_student, {id, onLoad})
  }


  render() {
    const DisplayComponent = ListComponent<StudentBaseResponseDto>;
    return (
      <div className="students-page">
        <DisplayComponent
          title ='List of students'
          getId={(item) => item.studentId} 
          items={this.state.students} 
          currentPage={this.state.currentPage || 0}
          totalPage={this.state.totalPage || 0}
          onOpenItem = {this.onOpenDetail.bind(this)}
          onLoadData={this.getStudents.bind(this)}
           />
          <StudentModal/>
      </div>
    );
  }
}


export class StudentModal extends Component<any,{
  displayOverlay?: boolean,
  student?:StudentDetailResponseDto
}> {

  removeEvent: (()=>void) | undefined;

  onLoad: (()=>void) | undefined;

  constructor(props:any) {
    super(props);
    this.state = {}
  }

  componentDidMount(){
    this.removeEvent = appEventEmitter.on(APP_EVENTS.app_display_student, ({id, onLoad}:{id: string, onLoad: ()=>void}) => {
      this.onLoad= onLoad;
      this.setState({displayOverlay: true, student: undefined});
      if (id) {
        appEventEmitter.emit(APP_EVENTS.app_loading, true);
        asyncGetStudentDetail(id).then(student => {
          appEventEmitter.emit(APP_EVENTS.app_loading, false);
          this.setState({ student});
        }).catch(error=>{
          toast.error(`Can not get student information!${error.response?.data?.error?.message || error.message}`);
        })
      }
    });
  }
  componentWillUnmount(){
    this.removeEvent && this.removeEvent();
  }


  async saveStudent (username: string,
    password: string,
    fullName: string,
    description: string,
    extra?: ExtraInfo[]) {
      try {
        appEventEmitter.emit(APP_EVENTS.app_loading, true);
      await asyncSaveStudent({
        studentId: this.state.student?.studentId,
        username, password, fullName,description,extra
      })
      this.onLoad && this.onLoad();
      this.onLoad = undefined;
      appEventEmitter.emit(APP_EVENTS.app_loading, false);
      this.setState({displayOverlay: false});
    }catch(error: any) {
      appEventEmitter.emit(APP_EVENTS.app_loading, false);
      toast.error(`Can not get students!${error.response?.data?.error?.message || error.message}`);
    }
  }

  async deleteStudent () {
    if (!this.state.student?.studentId) {
      return;
    }
    try {
      appEventEmitter.emit(APP_EVENTS.app_loading, true);
      await asyncDeleteStudent(this.state.student.studentId);
      this.onLoad && this.onLoad();
      appEventEmitter.emit(APP_EVENTS.app_loading, false);
      this.setState({displayOverlay: false});
      this.onLoad=undefined;
    }catch(error: any) {
      appEventEmitter.emit(APP_EVENTS.app_loading, false);
      toast.error(`Can not delete students!${error.response?.data?.error?.message || error.message}`);
    }
  }

  render(): ReactNode {
    return <OverlayComponent display={!!this.state.displayOverlay}>
    {this.state.displayOverlay && <ItemDetailComponent<StudentDetailResponseDto>
      item= {this.state.student}
      onClose={()=>this.setState({displayOverlay: false})}
      getId={(item)=> item.studentId}
      onSave={this.saveStudent.bind(this)}
      onDelete={this.deleteStudent.bind(this)}
      title='Student'
     />}
  </OverlayComponent>;
  }

}


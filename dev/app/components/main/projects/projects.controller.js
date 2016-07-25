ProjectsController.$inject = ['projects', 'TbUtils', '$state', 'ModalService',
                                    '$rootScope','auth', '$scope', 'filterFilter'];

function ProjectsController (projects, TbUtils, $state, ModalService,
                            $rootScope, auth, $scope, filterFilter) {
    var vm = this;
    var deleteIndex = -1;
    var deleteProject = {};
    var confirmDeleteModal = {
      templateUrl: 'templates/components/main/projects/' +
                   'confirm-delete/confirm-delete.html',
      controller: 'ConfirmDeleteController'
    };
    
    vm.options = {};
    vm.options.startingPage = 0;
    vm.options.pageSize = 60;
    vm.options.count = 0;

    vm.projects = [];
    vm.totalProjects = [];
    vm.projectsPagination = [];
    vm.projectsLoading = true;
    vm.limitInLettersToSearch = 3;
    vm.deletingProject = [];
    vm.preventGeneralLoading = preventGeneralLoading;
    vm.removeProjectClicked = removeProjectClicked;
    vm.goToEdit = goToEdit;
    vm.toTitleCase = TbUtils.toTitleCase;

    vm.reportButton = {
        show: $rootScope.Role === 'Student',
        onClick: loadReport,
        icon: 'glyphicon-file'
    };

    projects.getProjects(getTotalProjectsSuccess, getTotalProjectsFail);

    function getTotalProjectsSuccess(response) {
        console.log(response);
        TbUtils.fillListWithResponseData(response.data, vm.totalProjects);
    }

    $scope.$watch('search.data', function(term) {
        let obj = {Name: term};

        if(term && term.length >= vm.limitInLettersToSearch) {
            $scope.filterProjects = filterFilter(vm.totalProjects, obj);
            vm.projects = $scope.filterProjects;
        }

        else {
            console.log('vacio');
            vm.projects = vm.projectsPagination;
        }
    });

    function getTotalProjectsFail(response) {
        console.log(resposne);
    }

    function preventGeneralLoading () {
        TbUtils.preventGeneralLoading();
    }

    function removeProjectClicked (project, index) {
        deleteProject = project;
        deleteIndex = index;
        
        ModalService.showModal(confirmDeleteModal)
          .then(modalResolve);
    }

    function modalResolve (modal) {
      modal.element.modal();
      modal.close.then(modalClose);
    }

    function modalClose (result) {
        if (result === true) 
          removeProject();
    }

    function removeProject () {
        vm.deletingProject[deleteIndex] = true;

        projects.deleteProject(deleteProject.Id, 
            removeProjectSucces, removeProjectFail);
    }

    function removeProjectSucces () {
        vm.projects.splice(deleteIndex, 1);
        vm.deletingProject.splice(deleteIndex, 1);
    }

    function removeProjectFail (response) {
        TbUtils.showErrorMessage('error', response,
                                 'No se pudo borrar el proyecto.',
                                 'Error');

        vm.deletingProject[deleteIndex] = false;
    }

    projects.getProjectsCount(getProjectsCountSuccess);

    function getProjectsCountSuccess(response){
        vm.options.count = response.data;
        projects.getProjectsWithPagination( vm.options.startingPage, vm.options.pageSize ,getProjectsSuccess, getProjectsFail);
    }

    vm.onPageChange = function(skip, page){
        if($scope.search) $scope.search.data = '';
        vm.projects = vm.projectsPagination;
        vm.projects.length = 0;
        vm.projectsLoading = true;
        projects.getProjectsWithPagination( page, skip, getProjectsSuccess, getProjectsFail);
    }

    function goToEdit (project) {
        preventGeneralLoading();
        $state.go('main.editproject', { project: JSON.stringify(project) });
    }
    
    function getProjectsSuccess(response) {
        TbUtils.fillListWithResponseData(response.data, vm.projectsPagination);
        TbUtils.initArrayToValue(vm.deletingProject, false, 
                                 vm.projectsPagination.length);

        vm.projectsLoading = false;
    }
    
    function getProjectsFail(response) {
        TbUtils.showErrorMessage('error', response,
                                 'No se ha podido obtener los proyectos deseados.',
                                 'Error');

        vm.projectsLoading = false;
    }

    function successAccountId(response){
        response = response.data;
        let params = {
            templateUrl: 'reports/hours-by-student/hours-by-student.html',
            previousState: 'main.projects',
            previousStateParams: { },
            reportParams: {
                AccountId: response.AccountId,
                Campus: response.Campus,
                Major: response.Major.Name,
                Name: response.Name
            },
            showPrintButton: false
        }
        TbUtils.preventGeneralLoading();
        $state.go('main.printarea', {
            params: params
        });
    }
    function failAccountId(){
        TbUtils.displayNotification('error', 'Error',
            'No se pudo cargar el reporte correctamente.');
    }
    function loadReport(){
        let email = $rootScope.Session;
        let obj = {
            Email: email
        }
        auth.AccountId(obj,
            successAccountId, failAccountId)
    }
}

module.exports = { name: 'ProjectsController', ctrl: ProjectsController };

ActionController::Routing::Routes.draw do |map|

  map.root  :controller => "page"
  
  #admin stuff
=begin
  map.connect '/admin/users', :controller => '/admin/users', :action => 'index'
  map.connect '/admin/users/:user_id', :controller => '/admin/users', :action => 'show', :user_id => /\d*/
  map.connect '/admin/users/:action', :controller => '/admin/users'
  map.connect '/admin/users/:action/:id', :controller => '/admin/users'
  map.resources :users, :path_prefix => '/admin'
=end
  
  map.connect '/admin', :controller => 'admin', :action => 'index'
  map.connect '/admin/user/:action/:id', :controller => 'admin/user'
  map.connect '/admin/student/:action/:id', :controller => 'admin/student'
  map.connect '/admin/school/:action/:id', :controller => 'admin/school'
  map.connect '/admin/location/:action/:id', :controller => 'admin/location'
  map.connect '/admin/session/:action/:id', :controller => 'admin/session'
  map.connect '/admin/lesson/:action/:id', :controller => 'admin/lesson'
  map.connect '/admin/registration/:action/:id', :controller => 'admin/registration'
  map.connect '/admin/sbc/:action/:id', :controller => 'admin/sbc'
  map.connect '/admin/timesheet/:action/:id', :controller => 'admin/timesheet'


  #album stuff
  map.resources :albums
  map.connect '/photobook/photo/:id/:size', :controller => 'photobook', :action => 'photo'
  map.connect '/photobook/album/:id/:view', :controller => 'photobook', :action => 'album'

  map.connect '/register/for/:session', :controller => 'register', :action => 'form'
  map.connect '/register/for/:session/:student', :controller => 'register', :action => 'form'

  map.connect '/sbc/register/:student', :controller => 'sbc', :action => 'register'

  map.connect '/parents/lessons/all/:id', :controller => 'parents', :action => 'all_lessons'

  map.connect ':controller/:action/:id'
end

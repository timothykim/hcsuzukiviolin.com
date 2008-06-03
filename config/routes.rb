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


  #album stuff
  map.resources :albums
  map.connect '/photobook/photo/:id/:size', :controller => 'photobook', :action => 'photo'
  map.connect '/photobook/album/:id/:view', :controller => 'photobook', :action => 'album'


  map.connect ':controller/:action/:id'
end

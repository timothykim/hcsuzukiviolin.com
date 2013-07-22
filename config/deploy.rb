<<<<<<< HEAD
set :application, "studio"
set :repository,  "git://github.com/highwind/gwsms-org.git"
set :domain, "gwsms.org"

set :scm, :git
=======
require 'mongrel_cluster/recipes'

set :application, "studio"
set :repository,  "git@github.com:highwind/gwsms.org.git"
set :domain, "celes"

set :scm, :git
#set :local_scm_command, "/opt/local/bin/git"
#set :scm_command, "/usr/bin/git"
>>>>>>> deploy
set :deploy_via, :remote_cache

set :user, "highwind"
set :runner, "highwind"
<<<<<<< HEAD
set :use_sudo, true
=======
set :use_sudo, false

set :branch, "master"
>>>>>>> deploy

set :deploy_to, "/home/highwind/sites/gwsms.org/rails/#{application}"
set :mongrel_conf, "#{current_path}/config/mongrel_cluster.yml"

role :app, domain
role :web, domain
role :db,  domain, :primary => true

<<<<<<< HEAD
=======
# downloads and apply live db data to dev db
task :fetch_db, :roles => [:app] do
  get "/var/www/backups/pgsql/suzuki_studio.latest.sql", "/tmp/suzuki_studio.latest.sql"
  %x[psql suzuki highwind < /tmp/suzuki_studio.latest.sql]
  %x[rm /tmp/suzuki_studio.latest.sql]
end
>>>>>>> deploy

# moves over server config
task :update_config, :roles => [:app] do
  run "cp -Rf #{shared_path}/config/* #{release_path}/config/"
end

<<<<<<< HEAD

=======
>>>>>>> deploy
#keep a single shared directory for photos
task :set_symlinks, :roles => [:app] do
  %w{datafiles}.each do |share|
    run "rm -rf #{release_path}/public/#{share}"
    run "mkdir -p #{shared_path}/system/#{share}"
    run "ln -nfs #{shared_path}/system/#{share} #{release_path}/public/#{share}"
  end
end

after 'deploy:update_code', :update_config
after 'deploy:update_code', :set_symlinks

<<<<<<< HEAD


=======
>>>>>>> deploy
deploy.task :default do
  transaction do
    update_code
    symlink
  end
end

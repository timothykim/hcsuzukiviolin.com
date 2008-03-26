set :application, "studio"
set :repository,  "git://github.com/highwind/hc-suzuki-studio.git"
set :domain, "hcsuzukiviolin.com"

set :scm, :git
set :deploy_via, :remote_cache

set :user, "highwind"
set :runner, "highwind"
set :use_sudo, false

set :deploy_to, "/home/highwind/sites/hcsuzukiviolin.com/rails/#{application}"
set :mongrel_conf, "#{current_path}/config/mongrel_cluster.yml"


role :app, domain
role :web, domain
role :db,  domain, :primary => true


# moves over server config
task :update_config, :rolse => [:app] do
  run "cp -Rf #{shared_path}/config/* #{release_path}/config/"
end
after 'deploy:update_code', :update_config


deploy.task :default do
  transaction do
    update_code
    symlink
  end
end

set :application, "studio"
set :repository,  "git@github.com:highwind/hc-suzuki-studio.git"
set :domain, "kgfamily.com"

set :scm, :git
set :scm_command, "/home/kgfamily/bin/git"

ssh_options[:paranoid] = false

set :user, "kgfamily"
set :use_sudo, false

set :deploy_to, "/home/kgfamily/rails/#{application}"


role :app, domain
role :web, domain
role :db,  domain, :primary => true


deploy.task :default do
  transaction do
    update_code
    symlink
  end
end

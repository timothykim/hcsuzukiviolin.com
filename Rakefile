# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require(File.join(File.dirname(__FILE__), 'config', 'boot'))

require 'rake'
require 'rake/testtask'
require 'rake/rdoctask'

require 'tasks/rails'


namespace 'views' do
  desc 'Renames all your rhtml views to erb'
  task 'erb' do
    Dir.glob('app/views/**/*.erb').each do |file|
      puts `mv #{file} #{file.gsub(/\.erb$/, '.html.erb')}`
    end
  end
end

namespace 'img' do
  desc 'Generate single pixel png files with colors from Colors.all'
  task 'gen_pnges' do
    require 'app/models/colors'
    require 'RMagick'
    dir = "public/images/1x1/"
    FileUtils.mkdir_p(dir)
    Colors.all.each do |color|
      img = Magick::Image.new(1,1)
      brush = Magick::Draw.new
      brush.point(1,1) { self.fill = '#' + color.upcase }
      brush.draw(img)
      img.write(dir+color.upcase+".png")
    end
  end
end

namespace 'data' do
  desc 'Update registered_dates rows so that dates with nil will have same date as start'
  task 'update_registered_dates' do
    RegisteredDate.all.each do |rd|
      puts rd.user_input
    end
  end
end

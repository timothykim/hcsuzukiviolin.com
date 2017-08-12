class Content < ActiveRecord::Base

  def self.f(name)
    if name.blank?
      return nil
    end
    c = Content.find(:first, :conditions => {:name => name})
    if c.nil?
      Content.create({:name => name, :html => ""})
    end
    c
  end
end

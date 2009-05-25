class RegisteredDate < ActiveRecord::Base
  belongs_to :registration

  def clean?
    not (self.start.nil? or self.end.nil?)
  end

  #only call this from console
  def clean
    if not self.clean?
      puts self.user_input
      range = gets
      t = TimeRange.new(range)
      self.start = t.start
      self.end = t.done
      self.save
    end
  end
end
